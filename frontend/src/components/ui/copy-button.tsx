// frontend/src/components/ui/copy-button.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  value: string;
  ariaLabel?: string;
  className?: string;
}

export function CopyButton({ value, ariaLabel = "Copy", className }: CopyButtonProps) {
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
