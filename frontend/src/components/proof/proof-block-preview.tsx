import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui";

export interface ProofBlockPreviewProps {
  hash?: string;
}

export function ProofBlockPreview({ hash }: ProofBlockPreviewProps) {
  return (
    <div className="rounded-2xl bg-surface-glass border border-border-glass p-6 flex flex-col gap-4">
      <Badge tone="accent">Proof Block</Badge>
      <h2 className="text-lg font-semibold text-text font-heading">Share your verified proof</h2>
      <p className="text-sm text-text-muted leading-relaxed">
        Publishing the proof card converts your submission into distribution.
      </p>
      {hash ? (
        <Link href={`/proof/${hash}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:underline transition-colors">
          Open public Proof Block
          <ArrowRight width={14} height={14} aria-hidden="true" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-text-muted opacity-50 cursor-not-allowed" aria-disabled="true">
          <Lock width={13} height={13} aria-hidden="true" />
          Proof Block unlocks after registration
        </span>
      )}
    </div>
  );
}

export default ProofBlockPreview;
