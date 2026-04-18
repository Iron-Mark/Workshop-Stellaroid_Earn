"use client";

import { useEffect, useState } from "react";
import { DEMO_AUTOFILL_EVENT, DemoAutofillDetail } from "@/components/demo/demo-autofill-button";
import { Button, Input, Badge, Skeleton, useToast } from "@/components/ui";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import { getCertificate, verifyCertificate, CertificateRecord } from "@/lib/contract-client";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import styles from "./actions.module.css";

export interface VerifyFormProps {
  onVerified?: (hash: string, txHash?: string) => void;
}

function isValidHash(hash: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(hash.trim().replace(/^0x/i, ""));
}

type LookupState =
  | { status: "idle" }
  | { status: "loading"; hash: string }
  | { status: "found"; hash: string; record: CertificateRecord }
  | { status: "missing"; hash: string }
  | { status: "error"; hash: string; message: string };

export function VerifyForm({ onVerified }: VerifyFormProps) {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  const [certHash, setCertHash] = useState("");
  const [hashTouched, setHashTouched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });

  const normalizedHash = certHash.trim().replace(/^0x/i, "").toLowerCase();
  const configured = hasRequiredConfig();
  const hashOk = isValidHash(certHash);

  useEffect(() => {
    function onAutofill(e: Event) {
      const detail = (e as CustomEvent<DemoAutofillDetail>).detail;
      if (!detail) return;
      setCertHash(detail.certHash);
      setHashTouched(false);
      setLookup({ status: "idle" });
    }
    window.addEventListener(DEMO_AUTOFILL_EVENT, onAutofill);
    return () => window.removeEventListener(DEMO_AUTOFILL_EVENT, onAutofill);
  }, []);

  useEffect(() => {
    if (!configured || !hashOk) {
      setLookup({ status: "idle" });
      return;
    }

    const hash = normalizedHash;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLookup((current) =>
        current.status === "loading" && current.hash === hash
          ? current
          : { status: "loading", hash },
      );

      try {
        const record = await getCertificate(hash);
        if (cancelled) return;
        setLookup(record ? { status: "found", hash, record } : { status: "missing", hash });
      } catch (e) {
        if (cancelled) return;
        const h = humanizeError(e);
        setLookup({ status: "error", hash, message: h.detail });
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [configured, hashOk, normalizedHash]);

  const hashError =
    hashTouched && certHash.trim() !== "" && !isValidHash(certHash)
      ? "Must be exactly 64 hexadecimal characters"
      : undefined;

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  const currentLookup =
    lookup.status !== "idle" && lookup.hash === normalizedHash ? lookup : { status: "idle" as const };

  const canLookup = configured && hashOk && currentLookup.status !== "loading";
  const canVerify =
    configured &&
    walletConnected &&
    !verifying &&
    currentLookup.status === "found" &&
    !currentLookup.record.verified;

  async function resolveLookup(noisy: boolean) {
    if (!configured || !hashOk) return null;

    const hash = normalizedHash;
    setLookup({ status: "loading", hash });
    try {
      const record = await getCertificate(hash);
      setLookup(record ? { status: "found", hash, record } : { status: "missing", hash });
      return record;
    } catch (e) {
      const h = humanizeError(e);
      setLookup({ status: "error", hash, message: h.detail });
      if (noisy) {
        toast({ title: h.title, detail: h.detail, tone: "danger" });
      }
      return null;
    }
  }

  async function handleLookup() {
    setHashTouched(true);
    if (!canLookup) return;
    await resolveLookup(true);
  }

  async function handleVerify() {
    setHashTouched(true);
    if (!configured || !hashOk || !wallet.address || !walletConnected) return;

    const record =
      currentLookup.status === "found" ? currentLookup.record : await resolveLookup(true);

    if (!record) {
      toast({
        title: "Certificate not found",
        detail: "Only registered hashes can be marked verified.",
        tone: "warning",
      });
      return;
    }

    if (record.verified) {
      toast({
        title: "Already verified",
        detail: "This certificate is already marked verified on-chain.",
        tone: "neutral",
      });
      return;
    }

    setVerifying(true);
    try {
      const result = await withTimeout(
        verifyCertificate(wallet.address, normalizedHash),
        15000,
        "verify",
      );
      const txHash = result?.hash;
      if (result?.result === false) {
        setLookup({ status: "missing", hash: normalizedHash });
        toast({
          title: "Certificate not found",
          detail: "That hash is not registered yet, so it could not be marked verified.",
          tone: "warning",
          action: txHash
            ? {
                label: "View on stellar.expert \u2197",
                href: `${appConfig.explorerUrl}/tx/${txHash}`,
              }
            : undefined,
        });
        return;
      }
      setLookup({
        status: "found",
        hash: normalizedHash,
        record: { ...record, verified: true },
      });
      toast({
        title: "Certificate verified",
        tone: "success",
        action: txHash
          ? {
              label: "View on stellar.expert \u2197",
              href: `${appConfig.explorerUrl}/tx/${txHash}`,
            }
          : undefined,
      });
      onVerified?.(normalizedHash, txHash);
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setVerifying(false);
    }
  }

  const formHint = (() => {
    if (!configured) return "Set the contract configuration first before verifying on-chain.";
    if (!certHash.trim()) return "Paste a certificate hash. The app will check chain state before enabling verification.";
    if (!hashOk) return "Enter a full 64-character SHA-256 hash.";
    if (currentLookup.status === "loading") return "Checking whether this hash is already registered...";
    if (currentLookup.status === "missing") return "This hash is not registered, so on-chain verification is blocked.";
    if (currentLookup.status === "error") return currentLookup.message;
    if (currentLookup.status === "found" && currentLookup.record.verified)
      return "This certificate is already verified on-chain.";
    if (currentLookup.status === "found" && !walletConnected)
      return "Hash found. Connect Freighter on Stellar testnet to submit verification.";
    if (currentLookup.status === "found") return "Hash found on-chain. You can now mark it verified.";
    return "Use Look up if you want to refresh the current chain state manually.";
  })();

  return (
    <div className={styles.form}>
      <div className={styles.fieldRow}>
        <Input
          mono
          label="Certificate hash"
          value={certHash}
          onChange={(e) => {
            setCertHash(e.target.value);
            setLookup({ status: "idle" });
          }}
          onBlur={() => setHashTouched(true)}
          error={hashError}
          helper={hashTouched || certHash ? undefined : "The 64-character SHA-256 hash to look up or verify"}
          placeholder="0a1b2c..."
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.buttonRow}>
        <Button
          type="button"
          variant="secondary"
          onClick={handleLookup}
          disabled={!canLookup}
          loading={currentLookup.status === "loading"}
        >
          Look up (read-only)
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleVerify}
          disabled={!canVerify}
          loading={verifying}
        >
          Mark Verified (on-chain)
        </Button>
      </div>

      <p className={styles.formHint}>{formHint}</p>

      {currentLookup.status === "loading" && (
        <div className={styles.lookupPanel} aria-label="Loading certificate details" aria-busy="true">
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Status</span>
            <Skeleton width={72} height={22} radius={4} />
          </div>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Owner</span>
            <Skeleton width={160} height={18} radius={4} />
          </div>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Issuer</span>
            <Skeleton width={160} height={18} radius={4} />
          </div>
        </div>
      )}

      {currentLookup.status === "found" && (
        <div className={styles.lookupPanel}>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Status</span>
            <Badge tone={currentLookup.record.verified ? "success" : "accent"} dot>
              {currentLookup.record.verified ? "Verified" : "Registered"}
            </Badge>
          </div>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Owner</span>
            <span className={styles.lookupValue}>
              {shortenAddress(currentLookup.record.owner)}
            </span>
          </div>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Issuer</span>
            <span className={styles.lookupValue}>
              {shortenAddress(currentLookup.record.issuer)}
            </span>
          </div>
        </div>
      )}

      {currentLookup.status === "missing" && (
        <Badge tone="warning" dot>
          No certificate for that hash
        </Badge>
      )}

      {currentLookup.status === "error" && (
        <Badge tone="danger" dot>
          Unable to read chain state right now
        </Badge>
      )}
    </div>
  );
}

export default VerifyForm;
