"use client";

import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { useToast } from "@/components/ui";
import styles from "./demo-autofill-button.module.css";

export const DEMO_AUTOFILL_EVENT = "demo:autofill";

export interface DemoAutofillDetail {
  studentAddr: string;
  certHash: string;
  amount: string;
}

/**
 * Fresh 64-hex cert hash per click. Avoids `AlreadyExists` collisions
 * if the user clicks autofill multiple times or another demo ran before.
 */
function generateCertHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function DemoAutofillButton() {
  const { wallet } = useFreighterWallet();
  const { toast } = useToast();

  function handleClick() {
    if (!wallet.address || wallet.status !== "connected") {
      toast({
        title: "Connect Freighter first",
        detail:
          "The demo autofill uses your connected wallet as both issuer and student (single-wallet flow).",
        tone: "warning",
      });
      return;
    }

    window.dispatchEvent(
      new CustomEvent<DemoAutofillDetail>(DEMO_AUTOFILL_EVENT, {
        detail: {
          studentAddr: wallet.address,
          certHash: generateCertHash(),
          amount: "10",
        },
      }),
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles.fab}
      aria-label="Autofill demo inputs"
      title="Autofill demo inputs"
    >
      <span className={styles.dot} aria-hidden />
      Demo autofill
    </button>
  );
}

export default DemoAutofillButton;
