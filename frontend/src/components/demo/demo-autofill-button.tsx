"use client";

import { useFreighterWallet } from "@/hooks/use-freighter-wallet";
import { useToast } from "@/components/ui";
import { Button } from "@/components/ui";

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
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label="Autofill demo inputs"
      title="Autofill demo inputs"
      className="fixed right-5 bottom-5 z-50 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-border bg-surface hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] hover:-translate-y-px gap-2"
    >
      <span
        className="w-2 h-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
        aria-hidden
      />
      Demo autofill
    </Button>
  );
}

export default DemoAutofillButton;
