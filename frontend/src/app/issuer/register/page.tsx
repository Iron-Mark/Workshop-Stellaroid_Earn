import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { RpcStatusPill } from "@/components/layout/rpc-status-pill";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { NetworkBanner } from "@/components/app/network-banner";
import { WalletEmptyState } from "@/components/app/wallet-empty-state";
import { IssuerRegisterForm } from "@/components/issuer/issuer-register-form";
import {
  FreighterWalletProvider,
  useFreighterWallet,
} from "@/hooks/use-freighter-wallet";

export const metadata: Metadata = {
  title: "Register Issuer",
  description:
    "Create an on-chain issuer profile for the Phase 1 trust registry in Stellaroid Earn.",
};

function RegisterIssuerExperience() {
  const { wallet, isMobileBrowser } = useFreighterWallet();
  const showDesktopOnlyFallback = isMobileBrowser;
  const showInstallFallback = wallet.status === "unsupported" && !isMobileBrowser;
  const showWalletEmptyState = showDesktopOnlyFallback || showInstallFallback;

  return (
    <AppShell rpcPill={<RpcStatusPill />} walletButton={<WalletConnectButton />}>
      <div className="flex flex-col gap-6">
        <NetworkBanner wallet={wallet} />
        {showWalletEmptyState ? (
          <WalletEmptyState
            mode={showDesktopOnlyFallback ? "desktop-only" : "install-extension"}
          />
        ) : (
          <IssuerRegisterForm />
        )}
      </div>
    </AppShell>
  );
}

export default function RegisterIssuerPage() {
  return (
    <FreighterWalletProvider>
      <RegisterIssuerExperience />
    </FreighterWalletProvider>
  );
}
