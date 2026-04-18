"use client";

import {
  Account,
  Address,
  BASE_FEE,
  Operation,
  SorobanDataBuilder,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import {
  appConfig,
  getExpectedNetworkPassphrase,
  hasRequiredConfig,
} from "@/lib/config";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import { signWithFreighter } from "@/lib/freighter";

const FALLBACK_SIMULATION_SOURCE =
  "GBAKLRUJEOZGWKSHJFFWJ4DINXQZEJBT7JQTR5T4GATQU2SNO4ZFHZQ4";

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
  const configured = appConfig.readAddress?.trim();
  return configured || FALLBACK_SIMULATION_SOURCE;
}

type ContractArg =
  | { value: string; type: "address" | "string" }
  | { value: bigint | number; type: "i128" | "u32" }
  | { value: Uint8Array; type: "bytes32" };

function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.trim().replace(/^0x/i, "").toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(clean)) {
    throw new Error(
      "Certificate hash must be 64 hexadecimal characters (32 bytes).",
    );
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
      // Keep cert hash as ScVal bytes to match contract BytesN<32> params.
      return nativeToScVal(entry.value, { type: "bytes" });
    }
    return nativeToScVal(entry.value, { type: entry.type });
  });
}

type RawGetTransactionResult = {
  status?: string;
  errorResultXdr?: string;
};

type RawSendTransactionResult = {
  status?: string;
  hash?: string;
  errorResultXdr?: string;
};

function delayMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendTransactionRaw(transactionXdr: string) {
  const response = await fetch(appConfig.rpcUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `send-${Date.now()}`,
      method: "sendTransaction",
      params: {
        transaction: transactionXdr,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC sendTransaction failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as {
    result?: RawSendTransactionResult;
    error?: { message?: string };
  };

  if (payload.error?.message) {
    throw new Error(payload.error.message);
  }

  if (!payload.result) {
    throw new Error("RPC sendTransaction returned no result.");
  }

  return payload.result;
}

async function pollTransactionRaw(
  hash: string,
  attempts = 20,
  intervalMs = 1200,
) {
  for (let i = 0; i < attempts; i++) {
    const response = await fetch(appConfig.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: `tx-${hash}-${i}`,
        method: "getTransaction",
        params: { hash },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `RPC getTransaction failed with HTTP ${response.status}.`,
      );
    }

    const payload = (await response.json()) as {
      result?: RawGetTransactionResult;
      error?: { message?: string };
    };

    if (payload.error?.message) {
      throw new Error(payload.error.message);
    }

    const status = payload.result?.status;
    if (status === "SUCCESS" || status === "FAILED") {
      if (!payload.result) {
        throw new Error(
          "RPC getTransaction returned a terminal status without payload.",
        );
      }
      return payload.result;
    }

    if (status !== "NOT_FOUND" && status) {
      throw new Error(`Unexpected getTransaction status: ${status}`);
    }

    await delayMs(intervalMs);
  }

  return { status: "NOT_FOUND" } as RawGetTransactionResult;
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

function buildSimulationTransaction(
  sourceAddress: string,
  method: string,
  args: xdr.ScVal[],
) {
  const simulationSource = sourceAddress.trim() || FALLBACK_SIMULATION_SOURCE;
  const sourceAccount = new Account(simulationSource, "0");

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

async function prepareTransactionWithFallback(
  transaction: Awaited<ReturnType<typeof buildTransaction>>,
  method: string,
) {
  const server = getServer();

  try {
    return await server.prepareTransaction(transaction);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (!/Bad union switch/i.test(message)) {
      throw e;
    }

    // SDK parsers can fail on newer RPC XDR union arms. Use raw simulation and
    // assemble the minimal transaction fields required for submission.
    const rawSimulation = await server._simulateTransaction(transaction);
    if (rawSimulation.error) {
      throw new Error(normalizeError(rawSimulation.error));
    }
    if (!rawSimulation.transactionData || !rawSimulation.minResourceFee) {
      throw new Error("Simulation did not return Soroban transaction data.");
    }

    const classicFee = parseInt(transaction.fee, 10) || 0;
    const minResourceFee = parseInt(rawSimulation.minResourceFee, 10) || 0;
    const builder = TransactionBuilder.cloneFrom(transaction, {
      fee: String(classicFee + minResourceFee),
      sorobanData: new SorobanDataBuilder(
        rawSimulation.transactionData,
      ).build(),
      networkPassphrase: transaction.networkPassphrase,
    });

    // verify_certificate has no require_auth path in contract; keep this branch
    // narrow and avoid parsing auth entries that may contain unsupported unions.
    if (method !== "verify_certificate") {
      const invokeOp = transaction.operations[0];
      const existingAuth =
        invokeOp.type === "invokeHostFunction" && invokeOp.auth
          ? invokeOp.auth
          : [];
      const rawAuth = rawSimulation.results?.[0]?.auth ?? [];

      if (
        invokeOp.type === "invokeHostFunction" &&
        existingAuth.length === 0 &&
        rawAuth.length > 0
      ) {
        builder.clearOperations();
        builder.addOperation(
          Operation.invokeHostFunction({
            source: invokeOp.source,
            func: invokeOp.func,
            auth: rawAuth.map((entry) =>
              xdr.SorobanAuthorizationEntry.fromXDR(entry, "base64"),
            ),
          }),
        );
      }
    }

    return builder.build();
  }
}

async function simulateRead<T>(
  sourceAddress: string,
  method: string,
  args: xdr.ScVal[],
  transform: (value: unknown) => T,
) {
  if (appConfig.e2eMode && method === "get_certificate") {
    return transform({
      owner: "GAWIOVGF3N7G3K4J4Y6MGSQYPN4K53Q3VHWL5V66B5Y4BBJH3M6AJYLD",
      issuer: "GAWIOVGF3N7G3K4J4Y6MGSQYPN4K53Q3VHWL5V66B5Y4BBJH3M6AJYLD",
      verified: true,
    });
  }

  ensureConfigured();
  const server = getServer();
  const transaction = buildSimulationTransaction(sourceAddress, method, args);
  let simulation: Awaited<ReturnType<rpc.Server["simulateTransaction"]>>;

  try {
    simulation = await server.simulateTransaction(transaction);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (!/Bad union switch/i.test(message)) {
      throw e;
    }

    const rawSimulation = await server._simulateTransaction(transaction);
    if (rawSimulation.error) {
      throw new Error(normalizeError(rawSimulation.error));
    }

    const rawResultXdr = rawSimulation.results?.[0]?.xdr;
    if (!rawResultXdr) {
      throw new Error(`Simulation for ${method} returned no value.`);
    }

    const rawScVal = xdr.ScVal.fromXDR(rawResultXdr, "base64");
    return transform(scValToNative(rawScVal));
  }

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
  if (appConfig.e2eMode) {
    const fakeReturnValue =
      method === "verify_certificate" && transformReturn
        ? transformReturn(true)
        : undefined;

    return {
      hash: `e2e-${method}-${sourceAddress.slice(0, 6)}`,
      result: fakeReturnValue,
    };
  }

  ensureConfigured();
  const server = getServer();

  const transaction = await buildTransaction(sourceAddress, method, args);
  const preparedTransaction = await prepareTransactionWithFallback(
    transaction,
    method,
  );

  const signedXdr = await signWithFreighter(
    preparedTransaction.toXDR(),
    sourceAddress,
  );
  const signedTransaction = TransactionBuilder.fromXDR(
    signedXdr,
    getExpectedNetworkPassphrase(),
  );

  let sendHash: string;

  try {
    const sendResponse = await server.sendTransaction(signedTransaction);
    if (
      sendResponse.status !== "PENDING" &&
      sendResponse.status !== "DUPLICATE"
    ) {
      throw new Error(
        normalizeError(sendResponse.errorResult ?? sendResponse.status),
      );
    }
    sendHash = sendResponse.hash;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (!/Bad union switch/i.test(message)) {
      throw e;
    }

    // SDK parser can also fail in sendTransaction when decoding errorResultXdr.
    const rawSend = await sendTransactionRaw(signedTransaction.toXDR());

    if (!rawSend.hash) {
      throw new Error("Transaction submission did not return a hash.");
    }

    const status = rawSend.status ?? "";
    if (status !== "PENDING" && status !== "DUPLICATE") {
      throw new Error(normalizeError(rawSend.errorResultXdr ?? status));
    }

    sendHash = rawSend.hash;
  }

  let finalResponse:
    | Awaited<ReturnType<rpc.Server["pollTransaction"]>>
    | undefined;

  try {
    finalResponse = await server.pollTransaction(sendHash, {
      attempts: 20,
      sleepStrategy: () => 1200,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (!/Bad union switch/i.test(message)) {
      throw e;
    }

    // SDK XDR parser can fail when RPC returns newer union arms.
    // Fall back to raw JSON-RPC polling using status-only semantics.
    const rawResult = await pollTransactionRaw(sendHash, 20, 1200);
    if (rawResult.status === "NOT_FOUND") {
      throw new Error("Transaction submitted but not found on the RPC server.");
    }
    if (rawResult.status === "FAILED") {
      throw new Error(
        normalizeError(rawResult.errorResultXdr ?? "Transaction failed."),
      );
    }

    return {
      hash: sendHash,
      result: undefined,
    };
  }

  if (finalResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
    throw new Error("Transaction submitted but not found on the RPC server.");
  }

  if (finalResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
    throw new Error(normalizeError(finalResponse.resultXdr));
  }

  return {
    hash: sendHash,
    result:
      transformReturn && finalResponse.returnValue
        ? transformReturn(scValToNative(finalResponse.returnValue))
        : undefined,
  };
}

function normalizeAddress(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Address) return value.toString();
  if (value && typeof value === "object" && "toString" in value)
    return value.toString();
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
  if (appConfig.e2eMode) {
    return {
      owner: "GAWIOVGF3N7G3K4J4Y6MGSQYPN4K53Q3VHWL5V66B5Y4BBJH3M6AJYLD",
      issuer: "GAWIOVGF3N7G3K4J4Y6MGSQYPN4K53Q3VHWL5V66B5Y4BBJH3M6AJYLD",
      verified:
        certHashHex.trim().replace(/^0x/i, "").toLowerCase().length === 64,
    };
  }

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

export const E2E_SAMPLE_PROOF_HASH = DEFAULT_SAMPLE_PROOF_HASH;

export { normalizeAddress, normalizeBigInt };
