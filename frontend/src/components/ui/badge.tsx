// frontend/src/components/ui/badge.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { glowPulse } from "@/lib/motion";

const toneClasses: Record<string, string> = {
  neutral: "bg-text-muted/15 text-text-muted border-transparent",
  primary: "bg-primary/10 text-primary border-primary/30",
  accent:  "bg-accent/18 text-[#C4B5FD] border-accent/30",
  verified:"bg-verified-bg text-verified border-verified/30",
  success: "bg-success/12 text-success border-success/30",
  warning: "bg-warning/12 text-warning border-warning/30",
  danger:  "bg-danger/12 text-danger border-danger/30",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneClasses;
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "h-6 px-2.5 rounded-full",
        "font-pixel text-[12px] font-medium leading-none whitespace-nowrap",
        "border",
        toneClasses[tone] ?? toneClasses.neutral,
        className
      )}
      {...props}
    >
      {dot && (
        <motion.span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            tone === "verified" ? "bg-verified" :
            tone === "primary"  ? "bg-primary"  :
            tone === "accent"   ? "bg-[#C4B5FD]" : "bg-current"
          )}
          animate={glowPulse.animate}
        />
      )}
      {children}
    </span>
  );
}
