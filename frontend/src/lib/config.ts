import { Networks } from "@stellar/stellar-sdk";

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

const configuredPassphrase =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ?? TESTNET_PASSPHRASE;

export const appConfig = {
  rpcUrl:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org",
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "TESTNET",
  networkPassphrase: configuredPassphrase,
  e2eMode: process.env.NEXT_PUBLIC_E2E_MODE === "1",
  contractId: process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID ?? "",
  assetAddress: process.env.NEXT_PUBLIC_SOROBAN_ASSET_ADDRESS ?? "",
  assetCode: process.env.NEXT_PUBLIC_SOROBAN_ASSET_CODE ?? "XLM",
  assetDecimals: Number(process.env.NEXT_PUBLIC_SOROBAN_ASSET_DECIMALS ?? "7"),
  explorerUrl:
    process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL ??
    "https://stellar.expert/explorer/testnet",
  readAddress: process.env.NEXT_PUBLIC_STELLAR_READ_ADDRESS ?? "",
};

const networkPassphraseByName: Record<string, string> = {
  TESTNET: Networks.TESTNET,
  PUBLIC: Networks.PUBLIC,
  PUBNET: Networks.PUBLIC,
};

const networkLabelByName: Record<string, string> = {
  TESTNET: "Testnet",
  PUBLIC: "Pubnet",
  PUBNET: "Pubnet",
};

export function getExpectedNetworkPassphrase() {
  return networkPassphraseByName[appConfig.network] ?? appConfig.networkPassphrase;
}

export function getExpectedNetworkLabel() {
  return networkLabelByName[appConfig.network] ?? appConfig.network;
}

export function hasRequiredConfig() {
  return Boolean(appConfig.contractId && appConfig.rpcUrl);
}
