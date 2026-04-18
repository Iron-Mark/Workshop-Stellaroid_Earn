"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_AUTOFILL_EVENT, DemoAutofillDetail } from "@/components/demo/demo-autofill-button";
import { Button, Input, useToast } from "@/components/ui";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import { registerCertificate } from "@/lib/contract-client";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";

export interface RegisterFormProps {
  onSuccess?: (hash: string, studentAddr: string, txHash?: string) => void;
}

function isValidAddress(addr: string): boolean {
  const trimmed = addr.trim();
  return trimmed.startsWith("G") && trimmed.length === 56;
}

function isValidHash(hash: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(hash.trim().replace(/^0x/i, ""));
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [studentAddr, setStudentAddr] = useState("");
  const [certHash, setCertHash] = useState("");
  const [credentialTitle, setCredentialTitle] = useState("");
  const [cohort, setCohort] = useState("");
  const [metadataUri, setMetadataUri] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [studentTouched, setStudentTouched] = useState(false);
  const [hashTouched, setHashTouched] = useState(false);

  useEffect(() => {
    function onAutofill(e: Event) {
      const detail = (e as CustomEvent<DemoAutofillDetail>).detail;
      if (!detail) return;
      setStudentAddr(detail.studentAddr);
      setCertHash(detail.certHash);
      setCredentialTitle("Stellar Smart Contract Bootcamp Completion");
      setCohort("Stellar Philippines UniTour 2026");
      setStudentTouched(false);
      setHashTouched(false);
    }
    window.addEventListener(DEMO_AUTOFILL_EVENT, onAutofill);
    return () => window.removeEventListener(DEMO_AUTOFILL_EVENT, onAutofill);
  }, []);

  const studentError =
    studentTouched && studentAddr.trim() !== "" && !isValidAddress(studentAddr)
      ? "Must be a valid Stellar address (G..., 56 characters)"
      : undefined;

  const hashError =
    hashTouched && certHash.trim() !== "" && !isValidHash(certHash)
      ? "Must be exactly 64 hexadecimal characters"
      : undefined;

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  const canSubmit =
    hasRequiredConfig() &&
    walletConnected &&
    !submitting &&
    isValidAddress(studentAddr) &&
    isValidHash(certHash);

  async function handleHashFromFile(file: File) {
    const buf = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setCertHash(hex);
    setHashTouched(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStudentTouched(true);
    setHashTouched(true);

    if (!canSubmit || !wallet.address) return;

    setSubmitting(true);
    try {
      const result = await withTimeout(
        registerCertificate(wallet.address, studentAddr.trim(), certHash.trim(), {
          title: credentialTitle.trim(),
          cohort: cohort.trim(),
          metadataUri: metadataUri.trim(),
        }),
        15000,
        "register",
      );
      const txHash = result?.hash;
      toast({
        title: "Certificate registered",
        tone: "success",
        action: txHash
          ? {
              label: "View on stellar.expert \u2197",
              href: `${appConfig.explorerUrl}/tx/${txHash}`,
            }
          : undefined,
      });
      onSuccess?.(certHash.trim(), studentAddr.trim(), txHash);
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <Input
          mono
          label="Student wallet (G...)"
          value={studentAddr}
          onChange={(e) => setStudentAddr(e.target.value)}
          onBlur={() => setStudentTouched(true)}
          error={studentError}
          helper={studentTouched || studentAddr ? undefined : "Enter the student's Stellar public key"}
          placeholder="GABC...XYZ"
          autoComplete="off"
          spellCheck={false}
        />

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-start max-sm:flex-col max-sm:items-stretch">
            <div className="flex-1">
              <Input
                mono
                label="Certificate hash (64 hex)"
                value={certHash}
                onChange={(e) => setCertHash(e.target.value)}
                onBlur={() => setHashTouched(true)}
                error={hashError}
                helper={hashTouched || certHash ? undefined : "SHA-256 hash of the certificate file"}
                placeholder="0a1b2c..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 self-end max-sm:self-stretch"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Compute SHA-256 from file"
            >
              Compute SHA-256 from file
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleHashFromFile(f);
            }}
          />
        </div>

        <Input
          label="Credential title (optional)"
          value={credentialTitle}
          onChange={(e) => setCredentialTitle(e.target.value)}
          helper="Stored on-chain and shown on the proof page"
          placeholder="Stellar Smart Contract Bootcamp Completion"
          autoComplete="off"
          spellCheck={false}
        />

        <Input
          label="Cohort or batch (optional)"
          value={cohort}
          onChange={(e) => setCohort(e.target.value)}
          helper="Example: Stellar Philippines UniTour 2026"
          placeholder="Stellar Philippines UniTour 2026"
          autoComplete="off"
          spellCheck={false}
        />

        <Input
          label="Metadata URL (optional)"
          value={metadataUri}
          onChange={(e) => setMetadataUri(e.target.value)}
          helper="Use this later for hosted JSON evidence or richer proof details"
          placeholder="https://example.com/proofs/maria.json"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="flex gap-2 pt-1 max-sm:flex-col [&>*]:max-sm:w-full">
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          disabled={!canSubmit}
        >
          Register Certificate
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
