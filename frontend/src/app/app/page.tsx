"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RpcStatusPill } from "@/components/layout/rpc-status-pill";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { NextActionCard } from "@/components/actions/next-action-card";
import { MilestoneRail } from "@/components/milestones/milestone-rail";
import { RegisterForm } from "@/components/actions/register-form";
import { VerifyForm } from "@/components/actions/verify-form";
import { PayForm } from "@/components/actions/pay-form";
import { ProofBlockPreview } from "@/components/proof/proof-block-preview";
import { FreighterWelcome } from "@/components/onboarding/freighter-welcome";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import styles from "./page.module.css";

export default function Home() {
  const { wallet } = useFreighterWallet();
  const [role, setRole] = useState<"issuer" | "employer">("issuer");
  const [milestones, setMilestones] = useState({
    registered: false,
    verified: false,
    paid: false,
    lastHash: undefined as string | undefined,
    lastStudent: undefined as string | undefined,
  });

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  return (
    <AppShell rpcPill={<RpcStatusPill />} walletButton={<WalletConnectButton />}>
      <FreighterWelcome />
      <div className={styles.stack}>
        <NextActionCard
          role={role}
          setRole={setRole}
          milestones={milestones}
          walletConnected={walletConnected}
        />
        <MilestoneRail state={milestones} />
        <section>
          {role === "issuer" && (
            <RegisterForm
              onSuccess={(hash, student) =>
                setMilestones((m) => ({
                  ...m,
                  registered: true,
                  lastHash: hash,
                  lastStudent: student,
                }))
              }
            />
          )}
          {role === "employer" && !milestones.verified && (
            <VerifyForm
              onVerified={(hash) =>
                setMilestones((m) => ({ ...m, verified: true, lastHash: hash }))
              }
            />
          )}
          {role === "employer" && milestones.verified && !milestones.paid && (
            <PayForm
              onPaid={() => setMilestones((m) => ({ ...m, paid: true }))}
            />
          )}
        </section>
        <ProofBlockPreview hash={milestones.lastHash} />
      </div>
    </AppShell>
  );
}
