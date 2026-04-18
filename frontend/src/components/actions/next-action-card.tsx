"use client";

import styles from "./next-action-card.module.css";

export type Role = "issuer" | "employer";

export interface Milestones {
  registered: boolean;
  verified: boolean;
  paid: boolean;
  lastHash?: string;
  lastStudent?: string;
}

export interface NextActionCardProps {
  role: Role;
  setRole: (r: Role) => void;
  milestones: Milestones;
  walletConnected: boolean;
}

function IssuerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <circle cx="12" cy="15" r="2" />
      <path d="M12 13v-1M9 15h-1M15 15h1" opacity="0.4" />
    </svg>
  );
}

function EmployerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M2 13h20" opacity="0.5" />
      <path d="M11 13h2" />
    </svg>
  );
}

function getContent(
  role: Role,
  milestones: Milestones,
  walletConnected: boolean,
): { title: string; subtitle: string } {
  if (!walletConnected) {
    return {
      title: "Connect your wallet to start",
      subtitle: "You'll sign transactions with Freighter.",
    };
  }
  if (role === "issuer") {
    if (!milestones.registered) {
      return {
        title: "Register a certificate",
        subtitle:
          "Upload the PDF or paste a 64-char hex hash. You'll sign as the issuer.",
      };
    }
    return {
      title: "Certificate registered",
      subtitle: "Switch to Employer role to verify and pay.",
    };
  }
  if (!milestones.verified) {
    return {
      title: "Verify the certificate",
      subtitle: "Look it up first, then mark it verified on-chain.",
    };
  }
  if (!milestones.paid) {
    return {
      title: "Pay the verified student",
      subtitle: "Send the payment amount linked to this certificate.",
    };
  }
  return {
    title: "All done",
    subtitle: "The proof block is ready to share.",
  };
}

export function NextActionCard({
  role,
  setRole,
  milestones,
  walletConnected,
}: NextActionCardProps) {
  const { title, subtitle } = getContent(role, milestones, walletConnected);
  const indicatorPosition = role === "issuer" ? "0%" : "100%";

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div
          className={styles.segmented}
          role="radiogroup"
          aria-label="Select persona"
          data-active={role}
        >
          <span
            className={styles.indicator}
            style={{ transform: `translateX(${indicatorPosition})` }}
            aria-hidden="true"
          />
          <button
            type="button"
            className={`${styles.segBtn} ${role === "issuer" ? styles.segBtnActive : ""}`}
            onClick={() => setRole("issuer")}
            role="radio"
            aria-checked={role === "issuer"}
          >
            <IssuerIcon />
            <span className={styles.segLabel}>
              <span className={styles.segLabelTitle}>Issuer</span>
              <span className={styles.segLabelDesc}>Register certs</span>
            </span>
          </button>
          <button
            type="button"
            className={`${styles.segBtn} ${role === "employer" ? styles.segBtnActive : ""}`}
            onClick={() => setRole("employer")}
            role="radio"
            aria-checked={role === "employer"}
          >
            <EmployerIcon />
            <span className={styles.segLabel}>
              <span className={styles.segLabelTitle}>Employer</span>
              <span className={styles.segLabelDesc}>Verify &amp; pay</span>
            </span>
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}

export default NextActionCard;
