import Link from "next/link";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import styles from "./wallet-empty-state.module.css";

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
            "Install the Freighter extension in a desktop browser, then reconnect. Until then, you can still open a sample Proof Block and review the public verification flow.",
        };

  return (
    <section className={styles.card} aria-label="Wallet setup help">
      <span className={styles.eyebrow}>Wallet setup</span>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.body}>{copy.body}</p>
      <div className={styles.actions}>
        <a
          href="https://www.freighter.app/"
          target="_blank"
          rel="noreferrer"
          className={styles.primary}
        >
          Get Freighter ↗
        </a>
        <Link href={`/proof/${DEFAULT_SAMPLE_PROOF_HASH}`} className={styles.secondary}>
          Open sample Proof Block
        </Link>
      </div>
    </section>
  );
}

export default WalletEmptyState;
