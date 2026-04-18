"use client";

import { useEffect } from "react";
import { Button, Badge, useToast } from "@/components/ui";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { shortenAddress } from "@/lib/format";

export function WalletConnectButton() {
  const { wallet, connectWallet, disconnectWallet } = useFreighterWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (wallet.error && wallet.status !== "unsupported") {
      toast({
        title: "Wallet error",
        detail: wallet.error,
        tone: "danger",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.error]);

  if (wallet.status === "connecting") {
    return (
      <Button variant="primary" size="sm" loading>
        Connect Freighter
      </Button>
    );
  }

  if (wallet.status === "connected" && wallet.address) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {!wallet.isExpectedNetwork && (
          <Badge tone="warning" dot>Wrong network</Badge>
        )}
        <Badge tone="accent" dot>
          {shortenAddress(wallet.address)}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (wallet.status === "unsupported") {
    return (
      <Button variant="secondary" size="sm" disabled>
        Freighter unavailable
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={() => void connectWallet()}
    >
      Connect Freighter
    </Button>
  );
}

export default WalletConnectButton;
