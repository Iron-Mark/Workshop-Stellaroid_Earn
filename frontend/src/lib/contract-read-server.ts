import {
  Account,
  BASE_FEE,
  Operation,
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

const FALLBACK_SIMULATION_SOURCE =
  "GBAKLRUJEOZGWKSHJFFWJ4DINXQZEJBT7JQTR5T4GATQU2SNO4ZFHZQ4";

export type CertificateRecord = {
  owner: string;
  issuer: string;
  verified: boolean;
};

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

function getSimulationSourceAddress() {
  const configured = appConfig.readAddress?.trim();
  return configured || FALLBACK_SIMULATION_SOURCE;
}

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

function normalizeAddress(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toString" in value) {
    return value.toString();
  }
  throw new Error("Unable to parse Stellar address returned by the contract.");
}

function normalizeCertificate(value: unknown): CertificateRecord | null {
  if (value == null) return null;
  const record = value as Record<string, unknown>;
  return {
    owner: normalizeAddress(record.owner),
    issuer: normalizeAddress(record.issuer),
    verified: Boolean(record.verified),
  };
}

function buildSimulationTransaction(
  sourceAddress: string,
  certHashHex: string,
) {
  const sourceAccount = new Account(sourceAddress, "0");
  const args = [nativeToScVal(hexToBytes32(certHashHex), { type: "bytes" })];

  return new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: getExpectedNetworkPassphrase(),
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: appConfig.contractId,
        function: "get_certificate",
        args,
      }),
    )
    .setTimeout(30)
    .build();
}

export async function getCertificateServer(certHashHex: string) {
  ensureConfigured();
  const server = getServer();
  const transaction = buildSimulationTransaction(
    getSimulationSourceAddress(),
    certHashHex,
  );

  try {
    const simulation = await server.simulateTransaction(transaction);

    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(simulation.error);
    }
    if (!simulation.result?.retval) {
      throw new Error("Simulation for get_certificate returned no value.");
    }

    return normalizeCertificate(scValToNative(simulation.result.retval));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (!/Bad union switch/i.test(message)) {
      throw e;
    }

    const rawSimulation = await server._simulateTransaction(transaction);
    if (rawSimulation.error) {
      throw new Error(rawSimulation.error);
    }

    const rawResultXdr = rawSimulation.results?.[0]?.xdr;
    if (!rawResultXdr) {
      throw new Error("Simulation for get_certificate returned no value.");
    }

    const rawScVal = xdr.ScVal.fromXDR(rawResultXdr, "base64");
    return normalizeCertificate(scValToNative(rawScVal));
  }
}
