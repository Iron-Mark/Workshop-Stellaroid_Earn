"use client";

import { useEffect, useState } from "react";
import { DEMO_AUTOFILL_EVENT, DemoAutofillDetail } from "@/components/demo/demo-autofill-button";
import { Button, Input, useToast } from "@/components/ui";
import { HashInput } from "@/components/actions/hash-input";
import { humanizeError } from "@/lib/errors";
import { withTimeout } from "@/lib/with-timeout";
import { linkPayment } from "@/lib/contract-client";
import { appConfig, hasRequiredConfig } from "@/lib/config";
import { parseAmountToInt } from "@/lib/format";
import { useFreighterWallet } from "@/hooks/use-freighter-wallet";

export interface PayFormProps {
  initialHash?: string;
  initialStudent?: string;
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

export function PayForm({ initialHash, initialStudent, onPaid }: PayFormProps) {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  const [studentAddr, setStudentAddr] = useState(initialStudent ?? "");
  const [certHash, setCertHash] = useState(initialHash ?? "");
  const [payAmount, setPayAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [studentTouched, setStudentTouched] = useState(false);
  const [hashTouched, setHashTouched] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);

  useEffect(() => {
    if (initialStudent) {
      setStudentAddr((current) => current || initialStudent);
    }
  }, [initialStudent]);

  useEffect(() => {
    if (initialHash) {
      setCertHash((current) => current || initialHash);
    }
  }, [initialHash]);

  useEffect(() => {
    function onAutofill(e: Event) {
      const detail = (e as CustomEvent<DemoAutofillDetail>).detail;
      if (!detail) return;
      setStudentAddr(detail.studentAddr);
      setCertHash(detail.certHash);
      setPayAmount(detail.amount);
      setStudentTouched(false);
      setHashTouched(false);
      setAmountTouched(false);
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
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

        <HashInput
          value={certHash}
          onChange={setCertHash}
          onBlur={() => setHashTouched(true)}
          error={hashError}
          helper="Paste a SHA-256 hex string, upload a file, or drag it onto the field"
          touched={hashTouched}
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
              : `Testnet pays in ${appConfig.assetCode}. USDC-on-Stellar lands in v2, same flow, stable value.`
          }
          placeholder="10"
          autoComplete="off"
        />
      </div>

      <div className="flex gap-2 pt-1 max-sm:flex-col [&>*]:max-sm:w-full">
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
