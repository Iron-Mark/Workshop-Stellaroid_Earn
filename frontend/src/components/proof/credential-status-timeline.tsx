import type { CertificateStatus } from "@/lib/types";

interface StatusEvent {
  label: string;
  timestamp: number;
  active: boolean;
}

interface CredentialStatusTimelineProps {
  status: CertificateStatus;
  issuedAt: number;
  verifiedAt: number;
  expiresAt: number;
}

function formatTimestamp(ts: number): string {
  if (!ts) return "—";
  try {
    return new Date(ts * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function CredentialStatusTimeline({
  status,
  issuedAt,
  verifiedAt,
  expiresAt,
}: CredentialStatusTimelineProps) {
  const events: StatusEvent[] = [
    { label: "Issued", timestamp: issuedAt, active: true },
    { label: "Verified", timestamp: verifiedAt, active: status === "verified" },
  ];

  if (expiresAt) {
    events.push({
      label: "Expires",
      timestamp: expiresAt,
      active: status === "expired",
    });
  }

  if (status === "revoked") {
    events.push({ label: "Revoked", timestamp: 0, active: true });
  }
  if (status === "suspended") {
    events.push({ label: "Suspended", timestamp: 0, active: true });
  }

  return (
    <div className="flex flex-col gap-0">
      <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
        Status timeline
      </span>
      <ol className="flex flex-col gap-0 relative ml-2">
        {events.map((event, i) => (
          <li key={event.label} className="flex items-start gap-3 pb-3 last:pb-0">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${
                  event.active
                    ? event.label === "Revoked" || event.label === "Suspended"
                      ? "border-danger bg-danger"
                      : "border-success bg-success"
                    : "border-border bg-surface-2"
                }`}
              />
              {i < events.length - 1 ? (
                <div className="w-px flex-1 min-h-4 bg-border" />
              ) : null}
            </div>
            <div className="flex items-baseline gap-2 -mt-0.5">
              <span className="text-sm font-medium text-text">{event.label}</span>
              <span className="text-xs text-text-muted">
                {formatTimestamp(event.timestamp)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
