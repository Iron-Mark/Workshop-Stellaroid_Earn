"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Input, useToast } from "@/components/ui";
import { AppShell } from "@/components/layout/app-shell";
import { RpcStatusPill } from "@/components/layout/rpc-status-pill";
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button";
import { NetworkBanner } from "@/components/app/network-banner";
import { WalletEmptyState } from "@/components/app/wallet-empty-state";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { approveIssuer, getIssuer, suspendIssuer } from "@/lib/contract-client";
import { appConfig } from "@/lib/config";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import type { IssuerRecord } from "@/lib/types";

function statusTone(status: IssuerRecord["status"]): "success" | "warning" | "danger" {
  switch (status) {
    case "approved":
      return "success";
    case "suspended":
      return "danger";
    case "pending":
    default:
      return "warning";
  }
}

export function IssuerDashboard() {
  const { wallet, isMobileBrowser } = useFreighterWallet();
  const { toast } = useToast();
  const [issuer, setIssuer] = useState<IssuerRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetIssuer, setTargetIssuer] = useState("");
  const [targetRecord, setTargetRecord] = useState<IssuerRecord | null>(null);
  const [targetLookupBusy, setTargetLookupBusy] = useState(false);
  const [adminBusy, setAdminBusy] = useState<"approve" | "suspend" | null>(null);

  const showDesktopOnlyFallback = isMobileBrowser;
  const showInstallFallback = wallet.status === "unsupported" && !isMobileBrowser;
  const showWalletEmptyState = showDesktopOnlyFallback || showInstallFallback;
  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;
  const configuredAdmin = appConfig.adminAddress.trim().toUpperCase();
  const isAdminWallet =
    walletConnected &&
    !!wallet.address &&
    !!configuredAdmin &&
    wallet.address.trim().toUpperCase() === configuredAdmin;

  useEffect(() => {
    let cancelled = false;

    async function loadIssuer() {
      if (!walletConnected || !wallet.address) {
        setIssuer(null);
        return;
      }

      setLoading(true);
      try {
        const record = await getIssuer(wallet.address);
        if (!cancelled) {
          setIssuer(record);
        }
      } catch (e) {
        if (!cancelled) {
          setIssuer(null);
          const h = humanizeError(e);
          toast({ title: h.title, detail: h.detail, tone: "danger" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadIssuer();
    return () => {
      cancelled = true;
    };
  }, [walletConnected, wallet.address, toast]);

  async function handleTargetLookup() {
    if (!targetIssuer.trim()) return;
    setTargetLookupBusy(true);
    try {
      const record = await getIssuer(targetIssuer.trim());
      setTargetRecord(record);
      if (!record) {
        toast({
          title: "Issuer not found",
          detail: "No issuer record exists for that wallet yet.",
          tone: "warning",
        });
      }
    } catch (e) {
      setTargetRecord(null);
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setTargetLookupBusy(false);
    }
  }

  async function handleAdminAction(action: "approve" | "suspend") {
    if (!wallet.address || !targetIssuer.trim() || !isAdminWallet) return;

    setAdminBusy(action);
    try {
      const target = targetIssuer.trim();
      const result = await withTimeout(
        action === "approve"
          ? approveIssuer(wallet.address, target)
          : suspendIssuer(wallet.address, target),
        15000,
        action,
      );
      toast({
        title: action === "approve" ? "Issuer approved" : "Issuer suspended",
        detail:
          action === "approve"
            ? "The issuer can now publish and verify credentials with this wallet."
            : "The issuer is now blocked from publishing and verifying credentials.",
        tone: "success",
        action: result?.hash
          ? {
              label: "View on stellar.expert ↗",
              href: `${appConfig.explorerUrl}/tx/${result.hash}`,
            }
          : undefined,
      });
      const updated = await getIssuer(target);
      setTargetRecord(updated);
      if (
        wallet.address &&
        issuer &&
        wallet.address.trim().toUpperCase() === issuer.address.trim().toUpperCase()
      ) {
        setIssuer(updated);
      }
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setAdminBusy(null);
    }
  }

  return (
    <AppShell rpcPill={<RpcStatusPill />} walletButton={<WalletConnectButton />}>
      <div className="flex flex-col gap-6">
        <NetworkBanner wallet={wallet} />

        {showWalletEmptyState ? (
          <WalletEmptyState
            mode={showDesktopOnlyFallback ? "desktop-only" : "install-extension"}
          />
        ) : null}

        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                Issuer console
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-text">
                On-chain issuer status
              </h1>
              <p className="mt-2 max-w-[720px] text-sm text-text-muted">
                This route is the Phase 1 trust entrypoint. It tells the connected wallet whether
                it is unregistered, pending approval, approved, or suspended in the new issuer
                registry.
              </p>
            </div>
            {issuer ? (
              <Badge tone={statusTone(issuer.status)} dot>
                {issuer.status}
              </Badge>
            ) : (
              <Badge tone="accent" dot>
                {loading ? "Checking chain state" : "No issuer record"}
              </Badge>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xl font-semibold text-text">Connected wallet</h2>
            <div className="mt-4 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text-muted">
              {wallet.address ? (
                <>
                  <div className="font-mono text-text break-all">{wallet.address}</div>
                  <div className="mt-2">
                    Network status:{" "}
                    {wallet.isExpectedNetwork ? "Ready for testnet actions" : "Wrong network"}
                  </div>
                </>
              ) : (
                "Connect Freighter to inspect or register an issuer profile."
              )}
            </div>

            <div className="mt-5">
              {issuer ? (
                <div className="space-y-3 text-sm text-text-muted">
                  <div>
                    <span className="block text-xs uppercase tracking-[0.14em] text-text-muted/70">
                      Name
                    </span>
                    <span className="text-text">{issuer.name || "Unnamed issuer"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-[0.14em] text-text-muted/70">
                      Website
                    </span>
                    <span className="text-text">{issuer.website || "No website submitted"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-[0.14em] text-text-muted/70">
                      Category
                    </span>
                    <span className="text-text">{issuer.category || "Uncategorized"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-[0.14em] text-text-muted/70">
                      Status
                    </span>
                    <Badge tone={statusTone(issuer.status)} dot>
                      {issuer.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-text-muted">
                  No issuer record exists yet for the connected wallet. Register it first, then
                  ask the admin wallet to approve it.
                </p>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xl font-semibold text-text">Next actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Button variant="primary" className="w-full" href="/issuer/register">
                Register issuer profile
              </Button>
              <Button variant="secondary" className="w-full" href="/app">
                Open app flow
              </Button>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-text-muted">
              <li>1. Register issuer profile on-chain.</li>
              <li>2. Approve it with the admin wallet after redeploy.</li>
              <li>3. Issue credentials from the approved issuer wallet.</li>
              <li>4. Use trusted verification before payment.</li>
            </ul>
          </aside>
        </section>

        {isAdminWallet ? (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                  Admin controls
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-text">
                  Approve or suspend issuers
                </h2>
                <p className="mt-2 max-w-[720px] text-sm text-text-muted">
                  This panel is only shown when the connected wallet matches{" "}
                  <code className="font-mono text-text">NEXT_PUBLIC_STELLAR_ADMIN_ADDRESS</code>.
                </p>
              </div>
              <Badge tone="success" dot>
                Admin wallet active
              </Badge>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
              <Input
                label="Target issuer wallet"
                value={targetIssuer}
                onChange={(e) => {
                  setTargetIssuer(e.target.value);
                  setTargetRecord(null);
                }}
                placeholder="G..."
                helper="Paste the issuer wallet you want to approve or suspend."
                mono
              />
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() => void handleTargetLookup()}
                  loading={targetLookupBusy}
                  disabled={!targetIssuer.trim()}
                >
                  Load issuer
                </Button>
              </div>
            </div>

            {targetRecord ? (
              <div className="mt-5 rounded-xl border border-border bg-bg p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-base font-semibold text-text">
                      {targetRecord.name || "Unnamed issuer"}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {targetRecord.website || "No website"} · {targetRecord.category || "Uncategorized"}
                    </p>
                  </div>
                  <Badge tone={statusTone(targetRecord.status)} dot>
                    {targetRecord.status}
                  </Badge>
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  <Button
                    variant="primary"
                    onClick={() => void handleAdminAction("approve")}
                    loading={adminBusy === "approve"}
                    disabled={targetRecord.status === "approved"}
                  >
                    Approve issuer
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => void handleAdminAction("suspend")}
                    loading={adminBusy === "suspend"}
                    disabled={targetRecord.status === "suspended"}
                  >
                    Suspend issuer
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        ) : configuredAdmin ? (
          <section className="rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted">
            Admin controls are configured but hidden because the connected wallet does not match the
            configured admin address.
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}

export default IssuerDashboard;
