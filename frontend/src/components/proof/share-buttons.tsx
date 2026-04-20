"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const tweetText = `I just got verified proof of work, on-chain, instantly settled on @StellarOrg. Sub-cent fees. 5-second finality. No platform take rate.

Hash: ${hash}

Proof: ${url}

#Stellar #Soroban #ProofOfWork`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const linkedInText = `I just got verified proof of work, anchored on-chain with SHA-256 and settled atomically on Stellar. No 30-day invoice wait. No 20% platform fee. Just a link anyone can verify.

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
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
      {/* Share on X */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => openInNewTab(tweetUrl)}
        aria-label="Share on X (Twitter)"
      >
        {/* X (Twitter) mark — brand SVG, no Lucide equivalent */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
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
        {/* LinkedIn "in" mark — brand SVG, no Lucide equivalent */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
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
          <Check width={16} height={16} aria-hidden="true" />
        ) : (
          <Copy width={16} height={16} aria-hidden="true" />
        )}
        {copied ? "Copied ✓" : "Copy share link"}
      </Button>
    </div>
  );
}

export default ShareButtons;
