"use client";

import { useState } from "react";
import styles from "./copy-button.module.css";

export interface CopyButtonProps {
  value: string;
  ariaLabel?: string;
}

export function CopyButton({ value, ariaLabel = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write failed silently
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        aria-label={copied ? "Copied" : ariaLabel}
        title={copied ? "Copied!" : ariaLabel}
      >
        {copied ? (
          /* Check icon */
          <svg
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
        ) : (
          /* Copy icon: two overlapping rounded squares */
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="5"
              y="5"
              width="8"
              height="8"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2H3.5A1.5 1.5 0 0 0 2 3.5V9.5A1.5 1.5 0 0 0 3.5 11H5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
      <span
        className={styles.liveRegion}
        aria-live="polite"
        aria-atomic="true"
      >
        {copied ? "Copied" : ""}
      </span>
    </>
  );
}

export default CopyButton;
