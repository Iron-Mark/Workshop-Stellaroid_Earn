"use client";

import {
  getAddress,
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import { getExpectedNetworkPassphrase, appConfig } from "@/lib/config";
import type { WalletSnapshot } from "@/lib/types";

const E2E_WALLET_ADDRESS =
  "GAWIOVGF3N7G3K4J4Y6MGSQYPN4K53Q3VHWL5V66B5Y4BBJH3M6AJYLD";

function buildUnsupportedWallet(error?: string): WalletSnapshot {
  return {
    status: "unsupported",
    address: null,
    network: null,
    networkPassphrase: null,
    isExpectedNetwork: false,
    error: error ?? "Freighter is not available in this browser.",
  };
}

function buildE2EWallet(): WalletSnapshot {
  return {
    status: "connected",
    address: E2E_WALLET_ADDRESS,
    network: appConfig.network,
    networkPassphrase: getExpectedNetworkPassphrase(),
    isExpectedNetwork: true,
  };
}

export async function readFreighterWallet(): Promise<WalletSnapshot> {
  if (appConfig.e2eMode) {
    return {
      status: "disconnected",
      address: null,
      network: appConfig.network,
      networkPassphrase: getExpectedNetworkPassphrase(),
      isExpectedNetwork: true,
    };
  }

  const connection = await isConnected();

  if (connection.error) {
    return buildUnsupportedWallet(connection.error);
  }

  if (!connection.isConnected) {
    return {
      status: "disconnected",
      address: null,
      network: null,
      networkPassphrase: null,
      isExpectedNetwork: false,
    };
  }

  const [addressResponse, networkResponse] = await Promise.all([
    getAddress(),
    getNetworkDetails(),
  ]);

  if (addressResponse.error) {
    return {
      status: "disconnected",
      address: null,
      network: null,
      networkPassphrase: null,
      isExpectedNetwork: false,
      error: addressResponse.error,
    };
  }

  if (networkResponse.error) {
    return {
      status: addressResponse.address ? "connected" : "disconnected",
      address: addressResponse.address || null,
      network: null,
      networkPassphrase: null,
      isExpectedNetwork: false,
      error: networkResponse.error,
    };
  }

  const networkPassphrase =
    networkResponse.networkPassphrase || getExpectedNetworkPassphrase();

  const isExpectedNetwork =
    networkPassphrase === getExpectedNetworkPassphrase() ||
    networkResponse.network === appConfig.network;

  return {
    status: addressResponse.address ? "connected" : "disconnected",
    address: addressResponse.address || null,
    network: networkResponse.network ?? null,
    networkPassphrase,
    isExpectedNetwork,
  };
}

export async function connectFreighterWallet() {
  if (appConfig.e2eMode) {
    return buildE2EWallet();
  }

  const access = await requestAccess();

  if (access.error) {
    throw new Error(access.error);
  }

  return readFreighterWallet();
}

export async function signWithFreighter(transactionXdr: string, address: string) {
  if (appConfig.e2eMode) {
    return transactionXdr;
  }

  const result = await signTransaction(transactionXdr, {
    networkPassphrase: getExpectedNetworkPassphrase(),
    address,
  });

  if (result.error || !result.signedTxXdr) {
    throw new Error(result.error ?? "Freighter did not return a signed transaction.");
  }

  return result.signedTxXdr;
}
