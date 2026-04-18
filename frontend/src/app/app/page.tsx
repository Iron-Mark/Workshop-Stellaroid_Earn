"use client";

import { useState } from "react";
import { NetworkBanner } from "@/components/app/network-banner";
import { WalletEmptyState } from "@/components/app/wallet-empty-state";
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
import { DemoAutofillButton } from "@/components/demo/demo-autofill-button";
import {
  FreighterWalletProvider,
  useFreighterWallet,
} from "@/hooks/use-freighter-wallet";
import type { CertificateStatus } from "@/lib/types";

function AppExperience() {
  const { wallet, isMobileBrowser } = useFreighterWallet();
  const [role, setRole] = useState<"issuer" | "employer">("issuer");
  const [milestones, setMilestones] = useState({
    registered: false,
    verified: false,
    paid: false,
    credentialStatus: undefined as CertificateStatus | undefined,
    lastHash: undefined as string | undefined,
    lastStudent: undefined as string | undefined,
  });

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;
  const showDesktopOnlyFallback = isMobileBrowser;
  const showInstallFallback = wallet.status === "unsupported" && !isMobileBrowser;
  const showWalletEmptyState = showDesktopOnlyFallback || showInstallFallback;

  return (
    <AppShell rpcPill={<RpcStatusPill />} walletButton={<WalletConnectButton />}>
      {!showWalletEmptyState ? <FreighterWelcome /> : null}
      <div className="flex flex-col gap-6">
        <NetworkBanner wallet={wallet} />
        <div className="grid [grid-template-columns:minmax(0,1.5fr)_minmax(280px,0.95fr)] gap-6 items-start max-[920px]:grid-cols-1">
          <div className="flex flex-col gap-6 min-w-0">
            {showWalletEmptyState ? (
              <WalletEmptyState
                mode={showDesktopOnlyFallback ? "desktop-only" : "install-extension"}
              />
            ) : (
              <>
                <NextActionCard
                  role={role}
                  setRole={setRole}
                  milestones={milestones}
                  walletConnected={walletConnected}
                />
                <MilestoneRail state={milestones} />
                <section>
                  {role === "issuer" && (
                    <div className="flex flex-col gap-6">
                      <RegisterForm
                        onSuccess={(hash, student) =>
                          setMilestones((m) => ({
                            ...m,
                            registered: true,
                            verified: false,
                            paid: false,
                            credentialStatus: "issued",
                            lastHash: hash,
                            lastStudent: student,
                          }))
                        }
                      />
                      <VerifyForm
                        initialHash={milestones.lastHash}
                        allowTrustedActions
                        onVerified={(hash) =>
                          setMilestones((m) => ({
                            ...m,
                            verified: true,
                            credentialStatus: "verified",
                            lastHash: hash,
                          }))
                        }
                        onStatusChange={(hash, status, _txHash, record) =>
                          setMilestones((m) => ({
                            ...m,
                            verified: status === "verified",
                            credentialStatus: status,
                            lastHash: hash,
                            lastStudent: record?.owner ?? m.lastStudent,
                          }))
                        }
                      />
                    </div>
                  )}
                  {role === "employer" && (
                    <div className="flex flex-col gap-6">
                      <VerifyForm
                        initialHash={milestones.lastHash}
                        allowTrustedActions={false}
                        onStatusChange={(hash, status, _txHash, record) =>
                          setMilestones((m) => ({
                            ...m,
                            verified: status === "verified",
                            credentialStatus: status,
                            lastHash: hash,
                            lastStudent: record?.owner ?? m.lastStudent,
                          }))
                        }
                      />
                      {milestones.verified && !milestones.paid ? (
                        <PayForm
                          initialHash={milestones.lastHash}
                          initialStudent={milestones.lastStudent}
                          onPaid={() => setMilestones((m) => ({ ...m, paid: true }))}
                        />
                      ) : null}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
          <aside className="sticky top-24 max-[920px]:static">
            <ProofBlockPreview hash={milestones.lastHash} />
          </aside>
        </div>
        {!showWalletEmptyState ? <DemoAutofillButton /> : null}
      </div>
    </AppShell>
  );
}

export default function Home() {
  return (
    <FreighterWalletProvider>
      <AppExperience />
    </FreighterWalletProvider>
  );
}
