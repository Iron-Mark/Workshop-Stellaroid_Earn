"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_AUTOFILL_EVENT, DemoAutofillDetail } from "@/components/demo/demo-autofill-button";
import { Button, Input, useToast } from "@/components/ui";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import { registerCertificate } from "@/lib/contract-client";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import styles from "./actions.module.css";

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
  const [submitting, setSubmitting] = useState(false);

  const [studentTouched, setStudentTouched] = useState(false);
  const [hashTouched, setHashTouched] = useState(false);

  useEffect(() => {
    function onAutofill(e: Event) {
      const detail = (e as CustomEvent<DemoAutofillDetail>).detail;
      if (!detail) return;
      setStudentAddr(detail.studentAddr);
      setCertHash(detail.certHash);
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
        registerCertificate(wallet.address, studentAddr.trim(), certHash.trim()),
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
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fieldRow}>
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

        <div className={styles.hashRow}>
          <div className={styles.hashRowActions}>
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={styles.hashComputeBtn}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Compute SHA-256 from file"
            >
              Compute SHA-256 from file
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className={styles.hiddenInput}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleHashFromFile(f);
            }}
          />
        </div>
      </div>

      <div className={styles.submitRow}>
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
