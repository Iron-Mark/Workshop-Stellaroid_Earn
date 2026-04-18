"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import styles from "./share-buttons.module.css";

interface ShareButtonsProps {
  hash: string;
}

export function ShareButtons({ hash }: ShareButtonsProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const tweetText = `I just got verified proof of work — on-chain, instantly settled on @StellarOrg. Sub-cent fees. 5-second finality. No platform take rate.

Hash: ${hash}

Proof: ${url}

#Stellar #Soroban #ProofOfWork`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const linkedInText = `I just got verified proof of work — anchored on-chain with SHA-256 and settled atomically on Stellar. No 30-day invoice wait. No 20% platform fee. Just a link anyone can verify.

Hash: ${hash}

${url}

Built on Stellar + Soroban. #Stellar #Soroban #ProofOfWork #FreelanceEconomy`;
  const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInText)}`;

  function openInNewTab(href: string) {
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function handleCopy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write failed silently
    }
  }

  return (
    <div className={styles.row}>
      {/* Share on X */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => openInNewTab(tweetUrl)}
        aria-label="Share on X (Twitter)"
      >
        {/* X (Twitter) mark */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={styles.btnIcon}
        >
          <path
            d="M12.5 2.5L3.5 13.5M3.5 2.5L12.5 13.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        Share on X
      </Button>

      {/* Share on LinkedIn */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => openInNewTab(linkedInUrl)}
        aria-label="Share on LinkedIn"
      >
        {/* LinkedIn "in" mark */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={styles.btnIcon}
        >
          <rect x="2" y="2" width="4" height="12" rx="0.5" fill="currentColor" />
          <circle cx="4" cy="2" r="1.5" fill="currentColor" />
          <path
            d="M8 6.5V14M8 9.5C8 7.5 14 7 14 10V14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Share on LinkedIn
      </Button>

      {/* Copy share link */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCopy}
        aria-label="Copy share link"
      >
        {copied ? (
          /* Check icon on success */
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={styles.btnIcon}
          >
            <path
              d="M2.5 8.5L6.5 12.5L13.5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          /* Copy two-squares icon */
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={styles.btnIcon}
          >
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5V9.5A1.5 1.5 0 0 0 3.5 11H5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
        {copied ? "Copied ✓" : "Copy share link"}
      </Button>
    </div>
  );
}

export default ShareButtons;
