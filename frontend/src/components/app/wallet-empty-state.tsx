import Link from "next/link";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";

interface WalletEmptyStateProps {
  mode: "desktop-only" | "install-extension";
}

export function WalletEmptyState({ mode }: WalletEmptyStateProps) {
  const copy =
    mode === "desktop-only"
      ? {
          title: "Freighter is desktop-only.",
          body:
            "Open this demo on desktop to sign register / verify / pay. If you are reviewing on mobile, use a sample Proof Block instead — no wallet needed.",
        }
      : {
          title: "Freighter is not available in this browser.",
          body:
            "Install the Freighter extension in a desktop browser, then reconnect. Until then, you can still open a sample Proof Block and review the public proof flow.",
        };

  return (
    <section
      className="flex flex-col gap-3 p-[22px] bg-gradient-to-b from-[rgba(30,41,59,0.96)] to-[rgba(15,23,42,0.96)] border border-border rounded-2xl"
      aria-label="Wallet setup help"
    >
      <span className="inline-flex w-fit font-pixel text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-primary bg-primary/[0.12] border border-primary/25 rounded-full px-[10px] py-1">
        Wallet setup
      </span>
      <h2 className="m-0 text-2xl leading-[1.15] tracking-tight">{copy.title}</h2>
      <p className="m-0 text-muted-foreground leading-relaxed">{copy.body}</p>
      <div className="flex flex-wrap gap-2.5">
        <a
          href="https://www.freighter.app/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center min-h-[42px] px-4 rounded-md font-semibold no-underline bg-primary text-on-primary border border-primary hover:bg-primary-hover hover:text-on-primary"
        >
          Get Freighter ↗
        </a>
        <Link
          href={`/proof/${DEFAULT_SAMPLE_PROOF_HASH}`}
          className="inline-flex items-center justify-center min-h-[42px] px-4 rounded-md font-semibold no-underline text-foreground border border-border bg-transparent hover:bg-surface-2 hover:text-foreground"
        >
          Open sample Proof Block
        </Link>
      </div>
    </section>
  );
}

export default WalletEmptyState;
