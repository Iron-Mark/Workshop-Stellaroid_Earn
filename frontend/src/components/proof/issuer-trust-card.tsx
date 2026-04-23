import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { shortenAddress } from "@/lib/format";
import type { IssuerRecord } from "@/lib/types";

interface IssuerTrustCardProps {
  issuer: IssuerRecord;
}

function statusTone(status: IssuerRecord["status"]): "success" | "warning" | "danger" {
  switch (status) {
    case "approved":
      return "success";
    case "suspended":
      return "danger";
    case "pending":
    default:
      return "warning";
  }
}

export function IssuerTrustCard({ issuer }: IssuerTrustCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider">
          Issuer trust
        </span>
        <Badge tone={statusTone(issuer.status)} dot>
          {issuer.status}
        </Badge>
      </div>
      <p className="text-sm font-semibold text-text">
        {issuer.name || "Unnamed issuer"}
      </p>
      {issuer.website ? (
        <a
          href={issuer.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.8125rem] text-accent no-underline hover:underline inline-flex items-center gap-1"
        >
          {issuer.website.replace(/^https?:\/\//, "")}
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : null}
      <div className="flex items-center gap-2 text-[0.8125rem] text-text-muted">
        <code className="font-mono text-text bg-bg border border-border rounded px-1.5 py-0.5 text-xs">
          {shortenAddress(issuer.address, 6)}
        </code>
        <CopyButton value={issuer.address} ariaLabel="Copy issuer address" />
        <Badge tone="accent">{issuer.category || "uncategorized"}</Badge>
      </div>
    </div>
  );
}
