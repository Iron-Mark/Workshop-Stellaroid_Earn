"use client";

import { useEffect, useState } from "react";
import { connectFreighterWallet, readFreighterWallet } from "@/lib/freighter";
import type { WalletSnapshot } from "@/lib/types";

const initialWalletState: WalletSnapshot = {
  status: "disconnected",
  address: null,
  network: null,
  networkPassphrase: null,
  isExpectedNetwork: false,
};

export function useFreighterWallet() {
  const [wallet, setWallet] = useState<WalletSnapshot>(initialWalletState);

  async function refreshWallet() {
    setWallet((current) => ({
      ...current,
      status: current.status === "unsupported" ? "unsupported" : "connecting",
    }));

    try {
      const snapshot = await readFreighterWallet();
      setWallet(snapshot);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to read wallet state.";
      const fallback: WalletSnapshot = {
        status: "unsupported",
        address: null,
        network: null,
        networkPassphrase: null,
        isExpectedNetwork: false,
        error: message,
      };
      setWallet(fallback);
      return fallback;
    }
  }

  async function connectWallet() {
    setWallet((current) => ({ ...current, status: "connecting" }));
    try {
      const snapshot = await connectFreighterWallet();
      setWallet(snapshot);
      return snapshot;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to connect to Freighter.";
      const fallback: WalletSnapshot = {
        status: "disconnected",
        address: null,
        network: null,
        networkPassphrase: null,
        isExpectedNetwork: false,
        error: message,
      };
      setWallet(fallback);
      return fallback;
    }
  }

  function disconnectWallet() {
    setWallet(initialWalletState);
  }

  useEffect(() => {
    void refreshWallet();
  }, []);

  return { wallet, connectWallet, disconnectWallet, refreshWallet };
}
