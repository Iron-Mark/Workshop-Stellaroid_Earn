// frontend/src/components/ui/hash-reveal.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HashRevealProps {
  hash: string;
  /** Pre-computed short display string. If omitted, first8…last8 is used. */
  short?: string;
  className?: string;
}

export function HashReveal({ hash, short, className }: HashRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const display = revealed ? hash : (short ?? `${hash.slice(0, 8)}…${hash.slice(-8)}`);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <code className="font-mono text-[13px] text-primary [text-shadow:0_0_8px_rgba(245,158,11,0.35)]">
        {display}
      </code>
      <button
        type="button"
        onClick={() => setRevealed(r => !r)}
        aria-label={revealed ? "Hide full hash" : "Show full hash"}
        className="inline-flex items-center justify-center w-5 h-5 text-text-muted hover:text-primary transition-colors cursor-pointer"
      >
        {revealed
          ? <EyeOff className="w-3.5 h-3.5" />
          : <Eye className="w-3.5 h-3.5" />
        }
      </button>
    </span>
  );
}

export default HashReveal;
