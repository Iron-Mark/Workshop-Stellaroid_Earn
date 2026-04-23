"use client";

import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";

interface RecruiterCtaPanelProps {
  hash: string;
  candidateAddress?: string;
}

export function RecruiterCtaPanel({ hash, candidateAddress }: RecruiterCtaPanelProps) {
  const proofUrl = `https://stellaroid-earn-demo.vercel.app/proof/${hash}`;

  return (
    <section
      className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-4 flex flex-col gap-3"
      aria-label="Recruiter actions"
    >
      <span className="font-pixel text-xs font-medium text-primary uppercase tracking-wider">
        Recruiter actions
      </span>
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/employer"
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-on-primary font-semibold text-sm no-underline hover:bg-primary-hover transition-colors"
        >
          Fund paid trial
        </Link>
        <CopyButton value={proofUrl} label="Copy proof link" ariaLabel="Copy proof link" />
      </div>
      {candidateAddress ? (
        <Link
          href={`/talent/${candidateAddress}`}
          className="text-[0.8125rem] text-accent no-underline hover:underline"
        >
          View candidate passport →
        </Link>
      ) : null}
    </section>
  );
}
