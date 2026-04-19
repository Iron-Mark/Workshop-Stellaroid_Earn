"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Badge, useToast } from "@/components/ui";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import { registerIssuer } from "@/lib/contract-client";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";

const CATEGORIES = ["bootcamp", "university", "employer", "dao", "platform"];

function isValidWebsite(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function IssuerRegisterForm() {
  const router = useRouter();
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("bootcamp");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, website: false });

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  const nameError =
    touched.name && !name.trim() ? "Issuer name is required." : undefined;
  const websiteError =
    touched.website && !isValidWebsite(website)
      ? "Enter a valid http(s) URL or leave it blank."
      : undefined;

  const canSubmit =
    hasRequiredConfig() &&
    walletConnected &&
    !submitting &&
    !!name.trim() &&
    isValidWebsite(website) &&
    CATEGORIES.includes(category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, website: true });
    if (!canSubmit || !wallet.address) return;

    setSubmitting(true);
    try {
      const result = await withTimeout(
        registerIssuer(wallet.address, name.trim(), website.trim(), category),
        15000,
        "register issuer",
      );
      toast({
        title: "Issuer submitted",
        detail:
          "The issuer record is now on-chain with pending status. Ask the admin wallet to approve it next.",
        tone: "success",
        action: result?.hash
          ? {
              label: "View on stellar.expert ↗",
              href: `${appConfig.explorerUrl}/tx/${result.hash}`,
            }
          : undefined,
      });
      router.push("/issuer");
      router.refresh();
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5"
      noValidate
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-text">Register issuer</h2>
          <p className="mt-1 text-sm text-text-muted">
            This writes your issuer profile on-chain with a pending status. Approval still comes
            from the admin wallet.
          </p>
        </div>
        <Badge tone="accent" dot>
          Pending approval flow
        </Badge>
      </div>

      <Input
        label="Issuer name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setTouched((v) => ({ ...v, name: true }))}
        error={nameError}
        placeholder="Stellaroid Academy"
        helper="Displayed on proof pages once the issuer is approved."
      />

      <Input
        label="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        onBlur={() => setTouched((v) => ({ ...v, website: true }))}
        error={websiteError}
        placeholder="https://example.org"
        helper="Optional, but useful for recruiter-facing proof pages."
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="issuer-category" className="text-[13px] font-medium text-text-muted">
          Category
        </label>
        <select
          id="issuer-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-h-[44px] rounded-lg border border-border bg-surface-2 px-3 py-2 text-[15px] text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {CATEGORIES.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
        <p className="text-[12px] text-text-muted">
          Start narrow. Bootcamp and training-provider categories are the strongest fit today.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text-muted">
        Connected issuer wallet:
        <span className="ml-2 font-mono text-text">
          {wallet.address ?? "Connect Freighter first"}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button type="submit" variant="primary" loading={submitting} disabled={!canSubmit}>
          Register issuer on-chain
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/issuer")}>
          Back to issuer status
        </Button>
      </div>
    </form>
  );
}

export default IssuerRegisterForm;
