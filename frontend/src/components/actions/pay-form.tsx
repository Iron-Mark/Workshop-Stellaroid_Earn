"use client";

import { useState } from "react";
import { Button, Input, useToast } from "@/components/ui";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import { linkPayment } from "@/lib/contract-client";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import { parseAmountToInt } from "@/lib/format";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import styles from "./actions.module.css";

export interface PayFormProps {
  onPaid?: (hash: string, txHash?: string) => void;
}

function isValidAddress(addr: string): boolean {
  const trimmed = addr.trim();
  return trimmed.startsWith("G") && trimmed.length === 56;
}

function isValidHash(hash: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(hash.trim().replace(/^0x/i, ""));
}

function isValidAmount(amount: string): boolean {
  const n = Number(amount.trim());
  return Number.isFinite(n) && n > 0;
}

export function PayForm({ onPaid }: PayFormProps) {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  const [studentAddr, setStudentAddr] = useState("");
  const [certHash, setCertHash] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [studentTouched, setStudentTouched] = useState(false);
  const [hashTouched, setHashTouched] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);

  const studentError =
    studentTouched && studentAddr.trim() !== "" && !isValidAddress(studentAddr)
      ? "Must be a valid Stellar address (G..., 56 characters)"
      : undefined;

  const hashError =
    hashTouched && certHash.trim() !== "" && !isValidHash(certHash)
      ? "Must be exactly 64 hexadecimal characters"
      : undefined;

  const amountError =
    amountTouched && payAmount.trim() !== "" && !isValidAmount(payAmount)
      ? "Enter a positive number"
      : undefined;

  const walletConnected =
    wallet.status === "connected" && !!wallet.address && wallet.isExpectedNetwork;

  const canSubmit =
    hasRequiredConfig() &&
    walletConnected &&
    !submitting &&
    isValidAddress(studentAddr) &&
    isValidHash(certHash) &&
    isValidAmount(payAmount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStudentTouched(true);
    setHashTouched(true);
    setAmountTouched(true);

    if (!canSubmit || !wallet.address) return;

    setSubmitting(true);
    try {
      const amount = parseAmountToInt(payAmount.trim(), appConfig.assetDecimals);
      const result = await withTimeout(
        linkPayment(wallet.address, studentAddr.trim(), certHash.trim(), amount),
        15000,
        "pay",
      );
      const txHash = result?.hash;
      toast({
        title: "Payment settled",
        tone: "success",
        action: txHash
          ? {
              label: "View on stellar.expert \u2197",
              href: `${appConfig.explorerUrl}/tx/${txHash}`,
            }
          : undefined,
      });
      onPaid?.(certHash.trim(), txHash);
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
          helper={studentTouched || studentAddr ? undefined : "The student's Stellar public key"}
          placeholder="GABC...XYZ"
          autoComplete="off"
          spellCheck={false}
        />

        <Input
          mono
          label="Certificate hash"
          value={certHash}
          onChange={(e) => setCertHash(e.target.value)}
          onBlur={() => setHashTouched(true)}
          error={hashError}
          helper={hashTouched || certHash ? undefined : "The 64-character SHA-256 hash of the certificate"}
          placeholder="0a1b2c..."
          autoComplete="off"
          spellCheck={false}
        />

        <Input
          label={`Amount (${appConfig.assetCode})`}
          inputMode="decimal"
          value={payAmount}
          onChange={(e) => setPayAmount(e.target.value)}
          onBlur={() => setAmountTouched(true)}
          error={amountError}
          helper={
            amountTouched || payAmount
              ? undefined
              : `Testnet pays in ${appConfig.assetCode}. USDC-on-Stellar lands in v2 — same flow, stable value.`
          }
          placeholder="10"
          autoComplete="off"
        />
      </div>

      <div className={styles.submitRow}>
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          disabled={!canSubmit}
        >
          Pay Student
        </Button>
      </div>
    </form>
  );
}

export default PayForm;
