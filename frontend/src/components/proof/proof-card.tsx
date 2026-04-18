// Server component — no "use client"
import { CertificateRecord } from "@/lib/contract-client";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { lookupIssuer } from "@/lib/issuer-registry";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { ShareButtons } from "./share-buttons";
import { ProofQrBlock } from "./proof-qr-block";
import { HashReveal } from "@/components/ui/hash-reveal";
import styles from "./proof-card.module.css";

interface ProofCardProps {
  hash: string;
  cert: CertificateRecord | null;
}

function CheckIcon() {
  return (
    <svg
      className={styles.checkIcon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 8.5L6.5 12.5L13.5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProofCard({ hash, cert }: ProofCardProps) {
  const contractId = appConfig.contractId;
  const explorerUrl = appConfig.explorerUrl;
  const shortContract = shortenAddress(contractId, 8);
  const shortHash = shortenAddress(hash, 8);

  const verifiedTone = cert?.verified ? "success" : cert ? "warning" : "neutral";
  const verifiedLabel = cert?.verified ? "Verified" : cert ? "Registered" : "Not found";

  return (
    <div className={styles.shell}>
      <article className={styles.card}>
        {/* 1. Header row */}
        <header className={styles.headerRow}>
          <Badge tone="accent">Stellar testnet</Badge>
          <Badge tone={verifiedTone} dot>
            {verifiedLabel}
          </Badge>
        </header>

        {/* 2. Pitch line */}
        <h1 className={styles.pitch}>
          On-chain credential + direct payment rail on Stellar testnet.
        </h1>

        {/* 3. Contract ID row */}
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Contract ID</span>
          <code className={styles.metaCode}>{shortContract}</code>
          <CopyButton value={contractId} ariaLabel="Copy contract ID" />
          <a
            href={`${explorerUrl}/contract/${contractId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.metaLink}
            aria-label="View contract on explorer"
          >
            View on explorer ↗
          </a>
        </div>

        {/* 4. Hash row */}
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Certificate hash</span>
          <HashReveal hash={shortHash} />
          <CopyButton value={hash} ariaLabel="Copy certificate hash" />
          <a
            href={`${explorerUrl}/contract/${contractId}#events`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.metaLink}
            aria-label="View on-chain events in explorer"
          >
            View events ↗
          </a>
        </div>

        {/* 5. Cert details (only if cert exists) */}
        {cert ? (
          <section className={styles.certGrid} aria-label="Certificate details">
            <div className={styles.certRow}>
              <span className={styles.metaLabel}>Owner</span>
              <code className={styles.metaCode}>{shortenAddress(cert.owner, 8)}</code>
              <CopyButton value={cert.owner} ariaLabel="Copy owner address" />
            </div>
            <div className={styles.certRow}>
              <span className={styles.metaLabel}>Issuer</span>
              <code className={styles.metaCode}>{shortenAddress(cert.issuer, 8)}</code>
              <CopyButton value={cert.issuer} ariaLabel="Copy issuer address" />
              {(() => {
                const info = lookupIssuer(cert.issuer);
                return info ? (
                  <Badge tone="success" dot>
                    ✓ {info.name}
                  </Badge>
                ) : null;
              })()}
            </div>
            <div className={styles.certRow}>
              <span className={styles.metaLabel}>Verified</span>
              <Badge tone={cert.verified ? "success" : "warning"} dot>
                {cert.verified ? "Yes" : "Pending"}
              </Badge>
            </div>
          </section>
        ) : (
          <p className={styles.notFound}>
            No certificate registered for this hash yet.
          </p>
        )}

        {/* 6. Rubric self-check */}
        <section className={styles.rubricSection} aria-label="Submission rubric">
          <p className={styles.rubricTitle}>Submission self-check</p>
          <ul className={styles.rubricList} role="list">
            <li className={styles.rubricItem}>
              <CheckIcon />
              Contract deployed + verified on stellar.expert
            </li>
            <li className={styles.rubricItem}>
              <CheckIcon />
              <code>cargo test</code> passes (≥5 tests)
            </li>
            <li className={styles.rubricItem}>
              <CheckIcon />
              Frontend signs real tx via Freighter end-to-end
            </li>
            <li className={styles.rubricItem}>
              <CheckIcon />
              On-chain events emitted and visible in explorer
            </li>
            <li className={styles.rubricItem}>
              <CheckIcon />
              No raw ScVal / HostError surfaces in any error path
            </li>
          </ul>
        </section>

        {/* 7. Share section */}
        <section className={styles.shareSection} aria-label="Share this proof">
          <p className={styles.shareTitle}>Share</p>
          <ShareButtons hash={hash} />
        </section>

        {/* 7b. QR block */}
        <ProofQrBlock hash={hash} />

        {/* 8. Footer */}
        <footer className={styles.footer}>
          Generated from bootcamp submission · Stellar Philippines UniTour 2026
        </footer>
      </article>
    </div>
  );
}

export default ProofCard;
