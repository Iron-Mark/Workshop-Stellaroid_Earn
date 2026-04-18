"use client";

import {
  Address,
  BASE_FEE,
  Operation,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { appConfig, getExpectedNetworkPassphrase, hasRequiredConfig } from "@/lib/config";
import { signWithFreighter } from "@/lib/freighter";

function getServer() {
  return new rpc.Server(appConfig.rpcUrl, {
    allowHttp: appConfig.rpcUrl.startsWith("http://"),
  });
}

function ensureConfigured() {
  if (!hasRequiredConfig()) {
    throw new Error(
      "Missing contract configuration. Set NEXT_PUBLIC_SOROBAN_CONTRACT_ID in .env.local.",
    );
  }
}

function getReadAddress() {
  if (!appConfig.readAddress) {
    throw new Error(
      "NEXT_PUBLIC_STELLAR_READ_ADDRESS is not set. Provide a funded testnet account for read-only simulations.",
    );
  }
  return appConfig.readAddress;
}

type ContractArg =
  | { value: string; type: "address" | "string" }
  | { value: bigint | number; type: "i128" | "u32" }
  | { value: Uint8Array; type: "bytes32" };

function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/i, "").toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(clean)) {
    throw new Error("Certificate hash must be 64 hexadecimal characters (32 bytes).");
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function buildArgs(values: ContractArg[]): xdr.ScVal[] {
  return values.map((entry) => {
    if (entry.type === "bytes32") {
      return xdr.ScVal.scvBytes(Buffer.from(entry.value));
    }
    return nativeToScVal(entry.value, { type: entry.type });
  });
}

async function buildTransaction(
  sourceAddress: string,
  method: string,
  args: xdr.ScVal[],
) {
  const server = getServer();
  const sourceAccount = await server.getAccount(sourceAddress);

  return new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: getExpectedNetworkPassphrase(),
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: appConfig.contractId,
        function: method,
        args,
      }),
    )
    .setTimeout(30)
    .build();
}

async function simulateRead<T>(
  sourceAddress: string,
  method: string,
  args: xdr.ScVal[],
  transform: (value: unknown) => T,
) {
  ensureConfigured();
  const server = getServer();
  const transaction = await buildTransaction(sourceAddress, method, args);
  const simulation = await server.simulateTransaction(transaction);

  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(normalizeError(simulation.error));
  }

  if (!simulation.result?.retval) {
    throw new Error(`Simulation for ${method} returned no value.`);
  }

  return transform(scValToNative(simulation.result.retval));
}

async function signAndSubmit<T>(
  sourceAddress: string,
  method: string,
  args: xdr.ScVal[],
  transformReturn?: (value: unknown) => T,
) {
  ensureConfigured();
  const server = getServer();

  const transaction = await buildTransaction(sourceAddress, method, args);
  const preparedTransaction = await server.prepareTransaction(transaction);

  const signedXdr = await signWithFreighter(preparedTransaction.toXDR(), sourceAddress);
  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    getExpectedNetworkPassphrase(),
  );

  const sendResponse = await server.sendTransaction(signedTransaction);
  if (sendResponse.status !== "PENDING") {
    throw new Error(normalizeError(sendResponse.errorResult ?? sendResponse.status));
  }

  const finalResponse = await server.pollTransaction(sendResponse.hash, {
    attempts: 20,
    sleepStrategy: () => 1200,
  });

  if (finalResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
    throw new Error("Transaction submitted but not found on the RPC server.");
  }

  if (finalResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
    throw new Error(normalizeError(finalResponse.resultXdr));
  }

  return {
    hash: sendResponse.hash,
    result:
      transformReturn && finalResponse.returnValue
        ? transformReturn(scValToNative(finalResponse.returnValue))
        : undefined,
  };
}

function normalizeAddress(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Address) return value.toString();
  if (value && typeof value === "object" && "toString" in value) return value.toString();
  throw new Error("Unable to parse Stellar address returned by the contract.");
}

function normalizeBigInt(value: unknown): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  if (typeof value === "string") return BigInt(value);
  throw new Error("Unable to parse integer value returned by the contract.");
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  throw new Error("Unable to parse boolean value returned by the contract.");
}

// Maps Stellaroid Earn contracterror discriminants (1..6) to human copy.
// Never expose raw ScVal / HostError strings to the UI.
function normalizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/#1\b|AlreadyInitialized/i.test(message))
    return "Contract is already initialized.";
  if (/#2\b|NotInitialized/i.test(message))
    return "Contract has not been initialized yet — run init first.";
  if (/#3\b|Unauthorized/i.test(message))
    return "This wallet is not authorized to perform that action.";
  if (/#4\b|AlreadyExists/i.test(message))
    return "A certificate with that hash is already registered.";
  if (/#5\b|NotFound/i.test(message))
    return "No certificate found for that hash.";
  if (/#6\b|InvalidAmount/i.test(message))
    return "Amount must be greater than zero.";
  return message;
}

// --- Stellaroid Earn contract API ---

export type CertificateRecord = {
  owner: string;
  issuer: string;
  verified: boolean;
};

function normalizeCertificate(value: unknown): CertificateRecord | null {
  if (value == null) return null;
  const record = value as Record<string, unknown>;
  return {
    owner: normalizeAddress(record.owner),
    issuer: normalizeAddress(record.issuer),
    verified: Boolean(record.verified),
  };
}

export async function registerCertificate(
  issuer: string,
  student: string,
  certHashHex: string,
) {
  return signAndSubmit(
    issuer,
    "register_certificate",
    buildArgs([
      { value: issuer, type: "address" },
      { value: student, type: "address" },
      { value: hexToBytes32(certHashHex), type: "bytes32" },
    ]),
  );
}

export async function verifyCertificate(caller: string, certHashHex: string) {
  return signAndSubmit(
    caller,
    "verify_certificate",
    buildArgs([{ value: hexToBytes32(certHashHex), type: "bytes32" }]),
    normalizeBoolean,
  );
}

export async function getCertificate(certHashHex: string) {
  return simulateRead(
    getReadAddress(),
    "get_certificate",
    buildArgs([{ value: hexToBytes32(certHashHex), type: "bytes32" }]),
    normalizeCertificate,
  );
}

export async function rewardStudent(
  admin: string,
  student: string,
  certHashHex: string,
  amount: bigint,
) {
  return signAndSubmit(
    admin,
    "reward_student",
    buildArgs([
      { value: student, type: "address" },
      { value: hexToBytes32(certHashHex), type: "bytes32" },
      { value: amount, type: "i128" },
    ]),
  );
}

export async function linkPayment(
  employer: string,
  student: string,
  certHashHex: string,
  amount: bigint,
) {
  return signAndSubmit(
    employer,
    "link_payment",
    buildArgs([
      { value: employer, type: "address" },
      { value: student, type: "address" },
      { value: hexToBytes32(certHashHex), type: "bytes32" },
      { value: amount, type: "i128" },
    ]),
  );
}

export { normalizeAddress, normalizeBigInt };
