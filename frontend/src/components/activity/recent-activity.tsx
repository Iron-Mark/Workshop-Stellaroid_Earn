import { cn } from "@/lib/utils";
import { appConfig } from "@/lib/config";
import {
  formatRelativeTime,
  getRecentEvents,
  type RecentActivityItem,
} from "@/lib/events";

interface RecentActivityProps {
  className?: string;
  compact?: boolean;
  sidebar?: boolean;
}

function kindTag(kind: RecentActivityItem["kind"]) {
  if (kind === "payment" || kind === "reward")
    return "font-pixel text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded";
  if (kind === "cert_ver")
    return "font-pixel text-[11px] text-verified bg-verified-bg px-2 py-0.5 rounded";
  if (kind === "cert_reg")
    return "font-pixel text-[11px] text-accent bg-accent/10 px-2 py-0.5 rounded";
  return "font-pixel text-[11px] text-text-muted bg-surface-2 px-2 py-0.5 rounded";
}

export async function RecentActivity({
  className,
  compact = false,
  sidebar = false,
}: RecentActivityProps) {
  const events = await getRecentEvents(appConfig.contractId, compact ? 3 : 5);
  const hasContractLink = Boolean(appConfig.contractId);
  const contractEventsUrl = hasContractLink
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}#events`
    : null;

  const cardClass = cn(
    "rounded-2xl border border-border-glass bg-surface-glass p-6 flex flex-col gap-4",
    compact && "p-4 gap-3",
    sidebar && "p-4 gap-3",
    className
  );

  const eyebrowClass = cn(
    "font-pixel text-[11px] font-medium text-text-muted uppercase tracking-wider",
    (compact || sidebar) && "text-[10px]"
  );

  const titleClass = cn(
    "text-lg font-semibold text-text font-heading",
    (compact || sidebar) && "text-base"
  );

  const viewAllClass = cn(
    "text-[13px] text-accent no-underline hover:text-primary transition-colors whitespace-nowrap",
    (compact || sidebar) && "text-[12px]"
  );

  if (events.length === 0) {
    return (
      <section className={cardClass}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={eyebrowClass}>Live on-chain activity</p>
            <h2 className={titleClass}>Recent contract events</h2>
          </div>
          {contractEventsUrl && (
            <a href={contractEventsUrl} target="_blank" rel="noreferrer" className={viewAllClass}>
              View all ↗
            </a>
          )}
        </div>
        <p className={cn("text-sm text-text-muted", (compact || sidebar) && "text-[12px]")}>
          {hasContractLink
            ? "No events yet — complete the demo flow to see live on-chain activity here."
            : "Contract ID not configured yet — add it to enable live on-chain activity."}
        </p>
      </section>
    );
  }

  return (
    <section className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={eyebrowClass}>Live on-chain activity</p>
          <h2 className={titleClass}>Recent contract events</h2>
        </div>
        {contractEventsUrl && (
          <a href={contractEventsUrl} target="_blank" rel="noreferrer" className={viewAllClass}>
            View all ↗
          </a>
        )}
      </div>
      <div className="flex flex-col">
        {events.map((event) => (
          <a
            key={event.id}
            href={`${appConfig.explorerUrl}/tx/${event.txHash}`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex items-center gap-2 py-3 border-b border-border-glass last:border-0 no-underline flex-wrap",
              (compact || sidebar) && "py-2"
            )}
          >
            <span className={kindTag(event.kind)}>{event.label}</span>
            <span className="text-[13px] text-text flex-1 min-w-0 truncate">{event.detail}</span>
            <code className="font-mono text-[12px] text-text-muted hidden sm:inline">
              {event.txHash.slice(0, 10)}…{event.txHash.slice(-6)}
            </code>
            <span className="text-[11px] text-text-muted whitespace-nowrap">{formatRelativeTime(event.ledgerClosedAt)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;
