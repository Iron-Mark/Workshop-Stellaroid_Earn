import { NextResponse } from "next/server";
import { appConfig, hasRequiredConfig } from "@/lib/config";

type HealthStatus = "healthy" | "degraded" | "down";

type HealthReport = {
  status: HealthStatus;
  timestamp: string;
  checks: {
    config: { ok: boolean; detail: string };
    rpc: { ok: boolean; latencyMs: number; detail: string };
    contract: { ok: boolean; detail: string };
  };
};

export const revalidate = 0;

export async function GET() {
  const timestamp = new Date().toISOString();
  const configOk = hasRequiredConfig();

  let rpcOk = false;
  let rpcLatency = 0;
  let rpcDetail = "Not checked";

  if (configOk) {
    const start = Date.now();
    try {
      const response = await fetch(appConfig.rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "health-check",
          method: "getHealth",
          params: {},
        }),
        signal: AbortSignal.timeout(5000),
      });

      rpcLatency = Date.now() - start;

      if (response.ok) {
        const json = (await response.json()) as {
          result?: { status?: string };
        };
        rpcOk = json.result?.status === "healthy";
        rpcDetail = rpcOk
          ? `Healthy (${rpcLatency}ms)`
          : `RPC returned status: ${json.result?.status ?? "unknown"}`;
      } else {
        rpcDetail = `HTTP ${response.status}`;
      }
    } catch (err) {
      rpcLatency = Date.now() - start;
      rpcDetail =
        err instanceof Error ? err.message : "RPC connection failed";
    }
  }

  const contractOk = configOk && rpcOk;
  const contractDetail = !configOk
    ? "Config missing"
    : contractOk
      ? `Contract ${appConfig.contractId.slice(0, 8)}… reachable`
      : "RPC unavailable";

  const status: HealthStatus =
    configOk && rpcOk && contractOk
      ? "healthy"
      : configOk
        ? "degraded"
        : "down";

  const report: HealthReport = {
    status,
    timestamp,
    checks: {
      config: {
        ok: configOk,
        detail: configOk
          ? "All required env vars set"
          : "Missing NEXT_PUBLIC_SOROBAN_CONTRACT_ID or RPC URL",
      },
      rpc: { ok: rpcOk, latencyMs: rpcLatency, detail: rpcDetail },
      contract: { ok: contractOk, detail: contractDetail },
    },
  };

  return NextResponse.json(report, {
    status: status === "down" ? 503 : 200,
  });
}
