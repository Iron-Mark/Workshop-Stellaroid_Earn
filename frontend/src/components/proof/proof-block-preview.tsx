import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui";
import { getProofMetadata } from "@/lib/proof-metadata";
import type { CertificateStatus } from "@/lib/types";

export interface ProofBlockPreviewProps {
  hash?: string;
  certStatus?: CertificateStatus;
}

const FALLBACK_TITLE = "Pending Issuance";

function statusBadge(status: CertificateStatus) {
  switch (status) {
    case "verified":
      return { tone: "verified" as const, label: "Verified" };
    case "issued":
      return { tone: "warning" as const, label: "Awaiting verification" };
    case "revoked":
      return { tone: "danger" as const, label: "Revoked" };
    case "suspended":
      return { tone: "warning" as const, label: "Suspended" };
    case "expired":
      return { tone: "warning" as const, label: "Expired" };
    default:
      return { tone: "neutral" as const, label: status };
  }
}

export function ProofBlockPreview({ hash, certStatus }: ProofBlockPreviewProps) {
  const metadata = hash ? getProofMetadata(hash) : null;
  const credentialTitle = metadata?.title ?? FALLBACK_TITLE;
  const badge = certStatus ? statusBadge(certStatus) : null;

  return (
    <div className="rounded-2xl bg-surface-glass border border-border-glass p-6 flex flex-col gap-4">
      <Badge tone="accent">Stellaroid Verified Badge</Badge>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-semibold text-text font-heading leading-snug">
          {credentialTitle}
        </h2>
        {badge ? (
          <Badge tone={badge.tone} dot>
            {badge.label}
          </Badge>
        ) : null}
      </div>

      {hash ? (
        <>
          <p className="text-sm text-text-muted leading-relaxed">
            Your on-chain credential — anyone can verify it, no login needed.
          </p>
          <Link
            href={`/proof/${hash}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:underline transition-colors"
          >
            View &amp; share your proof
            <ArrowRight width={14} height={14} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-text-muted leading-relaxed">
            Your proof card unlocks after you complete registration. Once issued,
            anyone can verify it — no login needed.
          </p>
          <div className="flex items-center gap-2 opacity-55">
            <Lock width={14} height={14} aria-hidden="true" />
            <span
              className="text-sm text-text-muted cursor-not-allowed"
              aria-disabled="true"
            >
              Awaiting registration
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default ProofBlockPreview;
