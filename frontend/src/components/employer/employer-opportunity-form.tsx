"use client";

import { useState } from "react";
import { Button, Input, useToast } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import {
  getCertificate,
  createOpportunity,
  fundOpportunity,
} from "@/lib/contract-client";
import type { CertificateRecord } from "@/lib/contract-client";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import { ExternalLink } from "lucide-react";

export function EmployerOpportunityForm() {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  const [certHash, setCertHash] = useState("");
  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [lookupBusy, setLookupBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [milestones, setMilestones] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [createdOppId, setCreatedOppId] = useState<number | null>(null);
  const [funding, setFunding] = useState(false);

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  async function handleLookup() {
    if (!certHash.trim()) return;
    setLookupBusy(true);
    setCert(null);
    try {
      const record = await getCertificate(certHash.trim());
      setCert(record);
      if (!record) {
        toast({
          title: "Not found",
          detail: "No certificate on-chain for that hash.",
          tone: "warning",
        });
      }
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setLookupBusy(false);
    }
  }

  async function handleCreate() {
    if (!wallet.address || !cert) return;
    setSubmitting(true);
    try {
      const result = await withTimeout(
        createOpportunity(
          wallet.address,
          cert.owner,
          certHash.trim(),
          title.trim() || "Paid trial",
          BigInt(Math.round(parseFloat(amount) * 1e7)),
          parseInt(milestones) || 1,
        ),
        15000,
        "create opportunity",
      );
      const oppId = result?.result as number | undefined;
      if (oppId !== undefined) {
        setCreatedOppId(oppId);
      }
      toast({
        title: "Opportunity created",
        detail: `Opportunity ${oppId ?? ""} is in Draft status. Fund it next to start the escrow.`,
        tone: "success",
        action: result?.hash
          ? {
              label: <>View tx <ExternalLink className="inline w-3 h-3 ml-1" /></>,
              href: `${appConfig.explorerUrl}/tx/${result.hash}`,
            }
          : undefined,
      });
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFund() {
    if (!wallet.address || createdOppId === null) return;
    setFunding(true);
    try {
      const result = await withTimeout(
        fundOpportunity(wallet.address, createdOppId),
        15000,
        "fund opportunity",
      );
      toast({
        title: "Opportunity funded",
        detail: "Escrow is live. The candidate can now begin work.",
        tone: "success",
        action: result?.hash
          ? {
              label: <>View tx <ExternalLink className="inline w-3 h-3 ml-1" /></>,
              href: `${appConfig.explorerUrl}/tx/${result.hash}`,
            }
          : undefined,
      });
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setFunding(false);
    }
  }

  const parsedAmount = parseFloat(amount);
  const canCreate =
    hasRequiredConfig() &&
    walletConnected &&
    cert &&
    cert.status === "verified" &&
    !submitting &&
    parsedAmount > 0;

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-text">Look up credential</h2>
        <div className="flex gap-3 items-end">
          <Input
            label="Certificate hash"
            value={certHash}
            onChange={(e) => {
              setCertHash(e.target.value);
              setCert(null);
              setCreatedOppId(null);
            }}
            placeholder="64 hex characters"
            mono
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={() => void handleLookup()}
            loading={lookupBusy}
            disabled={!certHash.trim()}
          >
            Look up
          </Button>
        </div>

        {cert ? (
          <div className="rounded-xl border border-border bg-bg px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-semibold text-text">
                {cert.title || "Untitled credential"}
              </span>
              <Badge
                tone={cert.status === "verified" ? "success" : "warning"}
                dot
              >
                {cert.status}
              </Badge>
            </div>
            <span className="text-xs text-text-muted font-mono">
              Owner: {cert.owner}
            </span>
          </div>
        ) : null}
      </section>

      {cert && cert.status === "verified" ? (
        <section className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-text">Create paid trial</h2>
          <Input
            label="Opportunity title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 2-week frontend trial"
          />
          <Input
            label={`Amount (${appConfig.assetCode})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 100"
            helper="Funds will be held in escrow until you release them."
          />
          <Input
            label="Number of milestones"
            value={milestones}
            onChange={(e) => setMilestones(e.target.value)}
            placeholder="1"
            helper="Candidate submits each milestone for your approval before release."
          />
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="primary"
              onClick={() => void handleCreate()}
              loading={submitting}
              disabled={!canCreate}
            >
              Create opportunity
            </Button>
            {createdOppId !== null ? (
              <Button
                variant="primary"
                onClick={() => void handleFund()}
                loading={funding}
              >
                Fund escrow
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
