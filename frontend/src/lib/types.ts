export type WalletStatus = "disconnected" | "connecting" | "connected" | "unsupported";

export type TxState = "idle" | "signing" | "submitting" | "success" | "error";

export type WalletSnapshot = {
  status: WalletStatus;
  address: string | null;
  network: string | null;
  networkPassphrase: string | null;
  isExpectedNetwork: boolean;
  error?: string;
};

export type TxFeedback = {
  state: TxState;
  title: string;
  detail?: string;
  hash?: string;
};
