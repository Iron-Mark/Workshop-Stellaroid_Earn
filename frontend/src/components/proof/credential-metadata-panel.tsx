import Link from "next/link";
import type { ProofMetadata } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface CredentialMetadataPanelProps {
  metadata: ProofMetadata;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function CredentialMetadataPanel({
  metadata,
}: CredentialMetadataPanelProps) {
  return (
    <section
      className="grid gap-4 border-t border-border pt-4"
      aria-label="Credential metadata"
    >
      <div className="grid gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap">
            Credential
          </span>
          {metadata.cohort ? <Badge tone="primary">{metadata.cohort}</Badge> : null}
        </div>
        <h2 className="text-lg font-semibold text-text leading-tight">
          {metadata.title}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          {metadata.description}
        </p>
      </div>

      {metadata.skills.length > 0 ? (
        <div className="grid gap-2">
          <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap">
            Skills verified
          </span>
          <div className="flex gap-2 flex-wrap">
            {metadata.skills.map((skill) => (
              <Badge key={skill} tone="accent">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {metadata.criteria ? (
        <div className="grid gap-2">
          <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap">
            Issuance criteria
          </span>
          <p className="text-sm text-text-muted leading-relaxed">
            {metadata.criteria}
          </p>
        </div>
      ) : null}

      {metadata.evidence.length > 0 ? (
        <div className="grid gap-2">
          <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap">
            Evidence
          </span>
          <div className="grid gap-2">
            {metadata.evidence.map((item) =>
              isExternalHref(item.href) ? (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent no-underline hover:underline"
                >
                  {item.label} ↗
                </a>
              ) : (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="text-sm text-accent no-underline hover:underline"
                >
                  {item.label} →
                </Link>
              ),
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
