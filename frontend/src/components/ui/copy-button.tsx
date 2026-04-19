// frontend/src/components/ui/copy-button.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  value: string;
  ariaLabel?: string;
  className?: string;
  /** When provided, renders as an inline code pill with this label + copy icon */
  label?: string;
}

export function CopyButton({ value, ariaLabel = "Copy", className, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write failed silently
    }
  }

  if (label) {
    return (
      <>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : ariaLabel}
          className={cn(
            "inline-flex items-center gap-2",
            "font-mono text-[13px] font-medium tracking-wide text-primary",
            "bg-primary/8 hover:bg-primary/14",
            "border border-primary/25 hover:border-primary/40",
            "px-3 py-1.5 rounded-md",
            "transition-colors duration-150 cursor-pointer",
            copied && "text-success border-success/30 bg-success/8",
            className
          )}
        >
          {label}
          {copied
            ? <Check className="w-3 h-3 shrink-0" />
            : <Copy className="w-3 h-3 opacity-50 shrink-0" />
          }
        </button>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {copied ? "Copied" : ""}
        </span>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : ariaLabel}
        className={cn(
          "inline-flex items-center justify-center",
          "w-7 h-7 rounded-md",
          "text-text-muted hover:text-primary",
          "bg-transparent hover:bg-primary/10",
          "transition-colors duration-150 cursor-pointer",
          className
        )}
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-success" />
          : <Copy className="w-3.5 h-3.5" />
        }
      </button>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Copied" : ""}
      </span>
    </>
  );
}

export default CopyButton;
