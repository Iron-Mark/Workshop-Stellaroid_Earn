import { formatAmount } from "@/lib/format";
import { appConfig } from "@/lib/config";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import { xdr, scValToNative } from "@stellar/stellar-sdk";

type RpcEvent = {
  contractId: string;
  id: string;
  ledger: number;
  ledgerClosedAt: string;
  topic: string[];
  txHash: string;
  value: string;
};

type RpcHealthResponse = {
  latestLedger: number;
  oldestLedger: number;
};

export type RecentActivityItem = {
  id: string;
  kind: string;
  label: string;
  detail: string;
  hashHex: string | null;
  ledgerClosedAt: string;
  txHash: string;
};

function decodeScVal(base64: string) {
  return xdr.ScVal.fromXDR(base64, "base64");
}

function decodeScValToNative(base64: string) {
  return scValToNative(decodeScVal(base64));
}

function toHexString(value: unknown) {
  if (!value) return null;
  if (value instanceof Uint8Array) return Buffer.from(value).toString("hex");
  if (Buffer.isBuffer(value)) return value.toString("hex");
  if (Array.isArray(value) && value.every((entry) => typeof entry === "number")) {
    return Buffer.from(value).toString("hex");
  }
  if (typeof value === "object" && "data" in (value as Record<string, unknown>)) {
    const data = (value as { data?: unknown }).data;
    return toHexString(data);
  }
  return null;
}

function topicSymbol(base64: string) {
  const native = decodeScValToNative(base64);
  return typeof native === "string" ? native : "event";
}

function describeEvent(event: RpcEvent): RecentActivityItem | null {
  const kind = topicSymbol(event.topic[0] ?? "");
  const payload = decodeScValToNative(event.value);
  const hashHex = toHexString(payload);

  if (kind === "cert_fail") {
    return null;
  }

  const detailByKind: Record<string, string> = {
    init: "Contract bootstrapped",
    cert_reg: hashHex ? `Proof ${hashHex.slice(0, 10)}… registered` : "Certificate registered",
    cert_ver: hashHex ? `Proof ${hashHex.slice(0, 10)}… verified` : "Certificate verified",
    reward:
      typeof payload === "bigint" || typeof payload === "number" || typeof payload === "string"
        ? `${formatAmount(BigInt(payload), appConfig.assetDecimals)} ${appConfig.assetCode} reward`
        : "Student reward sent",
    payment:
      typeof payload === "bigint" || typeof payload === "number" || typeof payload === "string"
        ? `${formatAmount(BigInt(payload), appConfig.assetDecimals)} ${appConfig.assetCode} payment`
        : "Employer payment sent",
  };

  const labelByKind: Record<string, string> = {
    init: "Init",
    cert_reg: "Registered",
    cert_ver: "Verified",
    reward: "Reward",
    payment: "Payment",
  };

  if (!detailByKind[kind] || !labelByKind[kind]) {
    return null;
  }

  return {
    id: event.id,
    kind,
    label: labelByKind[kind],
    detail: detailByKind[kind],
    hashHex,
    ledgerClosedAt: event.ledgerClosedAt,
    txHash: event.txHash,
  };
}

async function rpcRequest<T>(method: string, params: object) {
  const response = await fetch(appConfig.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `${method}-${Date.now()}`,
      method,
      params,
    }),
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`RPC ${method} failed with ${response.status}.`);
  }

  const json = (await response.json()) as {
    error?: { message?: string };
    result?: T;
  };

  if (json.error) {
    throw new Error(json.error.message ?? `RPC ${method} failed.`);
  }

  if (!json.result) {
    throw new Error(`RPC ${method} returned no result.`);
  }

  return json.result;
}

export async function getRecentEvents(contractId: string, limit = 5) {
  if (appConfig.e2eMode) {
    return [
      {
        id: "e2e-cert-reg",
        kind: "cert_reg",
        label: "Registered",
        detail: `Proof ${DEFAULT_SAMPLE_PROOF_HASH.slice(0, 10)}… registered`,
        hashHex: DEFAULT_SAMPLE_PROOF_HASH,
        ledgerClosedAt: new Date().toISOString(),
        txHash: "e2e000000000000000000000000000000000000000000000000000000000001",
      },
      {
        id: "e2e-cert-ver",
        kind: "cert_ver",
        label: "Verified",
        detail: `Proof ${DEFAULT_SAMPLE_PROOF_HASH.slice(0, 10)}… verified`,
        hashHex: DEFAULT_SAMPLE_PROOF_HASH,
        ledgerClosedAt: new Date().toISOString(),
        txHash: "e2e000000000000000000000000000000000000000000000000000000000002",
      },
      {
        id: "e2e-payment",
        kind: "payment",
        label: "Payment",
        detail: `10 ${appConfig.assetCode} payment`,
        hashHex: null,
        ledgerClosedAt: new Date().toISOString(),
        txHash: "e2e000000000000000000000000000000000000000000000000000000000003",
      },
    ].slice(0, limit);
  }

  if (!contractId) return [];

  const health = await rpcRequest<RpcHealthResponse>("getHealth", {});
  const startLedger = Math.max(health.oldestLedger, health.latestLedger - 60000);
  const eventResult = await rpcRequest<{ events: RpcEvent[] }>("getEvents", {
    startLedger,
    endLedger: health.latestLedger + 1,
    filters: [
      {
        type: "contract",
        contractIds: [contractId],
      },
    ],
    pagination: {
      limit: 40,
    },
  });

  return eventResult.events
    .map(describeEvent)
    .filter((event): event is RecentActivityItem => Boolean(event))
    .sort(
      (left, right) =>
        new Date(right.ledgerClosedAt).getTime() - new Date(left.ledgerClosedAt).getTime(),
    )
    .slice(0, limit);
}

export async function getRecentProofHashes(contractId: string, limit = 3) {
  const events = await getRecentEvents(contractId, 12);
  const uniqueHashes = Array.from(
    new Set(
      events
        .filter((event) => (event.kind === "cert_reg" || event.kind === "cert_ver") && event.hashHex)
        .map((event) => event.hashHex as string),
    ),
  );

  return uniqueHashes.slice(0, limit);
}

export function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
