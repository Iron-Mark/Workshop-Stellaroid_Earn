import { appConfig } from "@/lib/config";
import {
  formatRelativeTime,
  getRecentEvents,
  type RecentActivityItem,
} from "@/lib/events";
import styles from "./recent-activity.module.css";

interface RecentActivityProps {
  className?: string;
  compact?: boolean;
}

function toneClass(kind: RecentActivityItem["kind"]) {
  if (kind === "payment" || kind === "reward") return styles.tonePayment;
  if (kind === "cert_ver") return styles.toneVerified;
  if (kind === "cert_reg") return styles.toneRegistered;
  return styles.toneNeutral;
}

export async function RecentActivity({
  className,
  compact = false,
}: RecentActivityProps) {
  const events = await getRecentEvents(appConfig.contractId, compact ? 3 : 5);

  if (events.length === 0) return null;

  return (
    <section className={[styles.card, className].filter(Boolean).join(" ")}>
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>Live on-chain activity</p>
          <h2 className={styles.title}>Recent contract events</h2>
        </div>
        <a
          href={`${appConfig.explorerUrl}/contract/${appConfig.contractId}#events`}
          target="_blank"
          rel="noreferrer"
          className={styles.viewAll}
        >
          View all ↗
        </a>
      </div>
      <div className={styles.list}>
        {events.map((event) => (
          <a
            key={event.id}
            href={`${appConfig.explorerUrl}/tx/${event.txHash}`}
            target="_blank"
            rel="noreferrer"
            className={styles.row}
          >
            <span className={`${styles.label} ${toneClass(event.kind)}`}>{event.label}</span>
            <span className={styles.detail}>{event.detail}</span>
            <code className={styles.hash}>
              {event.txHash.slice(0, 10)}…{event.txHash.slice(-6)}
            </code>
            <span className={styles.time}>{formatRelativeTime(event.ledgerClosedAt)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;
