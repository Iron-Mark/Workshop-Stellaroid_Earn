"use client";

import { useEffect, useState } from "react";
import type { WalletSnapshot } from "@/lib/types";
import { appConfig, getExpectedNetworkLabel } from "@/lib/config";
import styles from "./network-banner.module.css";

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
        detail: `This demo is on ${getExpectedNetworkLabel()} — switch networks in Freighter to continue.`,
      };

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <div>
        <p className={styles.title}>{copy.title}</p>
        <p className={styles.detail}>{copy.detail}</p>
      </div>
      <button
        type="button"
        className={styles.dismiss}
        onClick={() => setDismissedKey(bannerKey)}
        aria-label="Dismiss app warning"
      >
        Dismiss
      </button>
    </div>
  );
}

export default NetworkBanner;
