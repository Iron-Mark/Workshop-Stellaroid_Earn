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
  | { status: "loading" }
  | { status: "found"; record: CertificateRecord }
  | { status: "missing" };

export function VerifyForm({ onVerified }: VerifyFormProps) {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  const [certHash, setCertHash] = useState("");
  const [hashTouched, setHashTouched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });

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

  const hashError =
    hashTouched && certHash.trim() !== "" && !isValidHash(certHash)
      ? "Must be exactly 64 hexadecimal characters"
      : undefined;

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  const configured = hasRequiredConfig();
  const hashOk = isValidHash(certHash);
  const canLookup = configured && hashOk && lookup.status !== "loading";
  const canVerify = configured && walletConnected && hashOk && !verifying;

  async function handleLookup() {
    setHashTouched(true);
    if (!canLookup) return;

    setLookup({ status: "loading" });
    try {
      const record = await getCertificate(certHash.trim());
      if (record) {
        setLookup({ status: "found", record });
      } else {
        setLookup({ status: "missing" });
      }
    } catch (e) {
      const h = humanizeError(e);
      setLookup({ status: "missing" });
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    }
  }

  async function handleVerify() {
    setHashTouched(true);
    if (!canVerify || !wallet.address) return;

    setVerifying(true);
    try {
      const result = await withTimeout(
        verifyCertificate(wallet.address, certHash.trim()),
        15000,
        "verify",
      );
      const txHash = result?.hash;
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
      onVerified?.(certHash.trim(), txHash);
      // refresh lookup state
      setLookup({ status: "idle" });
    } catch (e) {
      const h = humanizeError(e);
      toast({ title: h.title, detail: h.detail, tone: "danger" });
    } finally {
      setVerifying(false);
    }
  }

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
          loading={lookup.status === "loading"}
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

      {lookup.status === "loading" && (
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

      {lookup.status === "found" && (
        <div className={styles.lookupPanel}>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Status</span>
            <Badge tone={lookup.record.verified ? "success" : "neutral"} dot>
              {lookup.record.verified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Owner</span>
            <span className={styles.lookupValue}>
              {shortenAddress(lookup.record.owner)}
            </span>
          </div>
          <div className={styles.lookupRow}>
            <span className={styles.lookupLabel}>Issuer</span>
            <span className={styles.lookupValue}>
              {shortenAddress(lookup.record.issuer)}
            </span>
          </div>
        </div>
      )}

      {lookup.status === "missing" && (
        <Badge tone="warning" dot>
          No certificate for that hash
        </Badge>
      )}
    </div>
  );
}

export default VerifyForm;
