"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui";
import { getCertificate } from "@/lib/contract-client";
import { hasRequiredConfig } from "@/lib/config";

type RpcState = "checking" | "healthy" | "slow";

const PROBE_INTERVAL_MS = 60_000;
const SLOW_THRESHOLD_MS = 4_000;
const DUMMY_HASH = "0".repeat(64);

async function probeRpc(): Promise<RpcState> {
  const start = Date.now();
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), SLOW_THRESHOLD_MS)
    );
    await Promise.race([getCertificate(DUMMY_HASH), timeoutPromise]);
    return Date.now() - start < SLOW_THRESHOLD_MS ? "healthy" : "slow";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.startsWith("TIMEOUT")) return "slow";
    // A contract error (e.g. NotFound) still means the RPC is reachable
    return Date.now() - start < SLOW_THRESHOLD_MS ? "healthy" : "slow";
  }
}

export function RpcStatusPill() {
  const [state, setState] = useState<RpcState>("checking");

  useEffect(() => {
    if (!hasRequiredConfig()) return;

    let cancelled = false;

    async function run() {
      const result = await probeRpc();
      if (!cancelled) setState(result);
    }

    void run();

    const interval = setInterval(() => {
      void run();
    }, PROBE_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!hasRequiredConfig()) return null;

  if (state === "checking") {
    return <Badge tone="neutral" dot>Checking…</Badge>;
  }

  if (state === "healthy") {
    return <Badge tone="success" dot>Testnet · live</Badge>;
  }

  return <Badge tone="warning" dot>Testnet · slow</Badge>;
}

export default RpcStatusPill;
