"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { WalletSnapshot } from "@/lib/types";
import { appConfig, getExpectedNetworkLabel } from "@/lib/config";

interface NetworkBannerProps {
  wallet: WalletSnapshot;
}

function normalizeConnectedNetwork(wallet: WalletSnapshot) {
  const raw = (wallet.network ?? wallet.networkPassphrase ?? "").toLowerCase();
  if (raw.includes("public")) return "Pubnet";
  if (raw.includes("test")) return "Testnet";
  return wallet.network ?? "another network";
}

export function NetworkBanner({ wallet }: NetworkBannerProps) {
  const bannerKey = !appConfig.contractId
    ? "missing-config"
    : wallet.status === "connected" && !wallet.isExpectedNetwork
      ? `network-${wallet.network ?? wallet.networkPassphrase ?? "unknown"}`
      : null;

  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  useEffect(() => {
    if (bannerKey !== dismissedKey) {
      setDismissedKey(null);
    }
  }, [bannerKey, dismissedKey]);

  if (!bannerKey || dismissedKey === bannerKey) return null;

  const copy = !appConfig.contractId
    ? {
        title: "Contract configuration is missing.",
        detail:
          "Set NEXT_PUBLIC_SOROBAN_CONTRACT_ID before running the live flow. Proof pages can still render, but register / verify / pay will stay disabled.",
      }
    : {
        title: `You're connected to ${normalizeConnectedNetwork(wallet)}.`,
        detail: `This app is on ${getExpectedNetworkLabel()}. Switch networks in Freighter to continue.`,
      };

  return (
    <div
      className="flex items-start justify-between gap-4 px-4 py-3.5 rounded-xl border border-warning/35 bg-warning/[0.12] max-sm:flex-col"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-warning" aria-hidden="true" />
        <div>
          <p className="m-0 mb-1 text-[0.9375rem] font-semibold text-foreground">{copy.title}</p>
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">{copy.detail}</p>
        </div>
      </div>
      <button
        type="button"
        className="min-h-9 px-3 rounded-md border border-warning/35 bg-background/25 text-foreground text-sm whitespace-nowrap cursor-pointer font-[inherit] hover:bg-background/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        onClick={() => setDismissedKey(bannerKey)}
        aria-label="Dismiss app warning"
      >
        Dismiss
      </button>
    </div>
  );
}

export default NetworkBanner;
