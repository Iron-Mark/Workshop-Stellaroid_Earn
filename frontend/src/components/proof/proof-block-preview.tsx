import Link from "next/link";
import { Badge } from "@/components/ui";
import styles from "./proof-block-preview.module.css";

export interface ProofBlockPreviewProps {
  hash?: string;
}

export function ProofBlockPreview({ hash }: ProofBlockPreviewProps) {
  return (
    <div className={styles.card}>
      <Badge tone="accent">Proof Block</Badge>
      <h2 className={styles.title}>Share your verified demo</h2>
      <p className={styles.muted}>
        Publishing the proof card converts your submission into distribution.
      </p>
      {hash ? (
        <Link href={`/proof/${hash}`} className={styles.openLink}>
          Open public Proof Block
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M2 7h10M7 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : (
        <span className={styles.disabledBtn} aria-disabled="true">
          Proof Block unlocks after registration
        </span>
      )}
    </div>
  );
}

export default ProofBlockPreview;
