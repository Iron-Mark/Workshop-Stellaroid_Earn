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
  // employer
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

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.segmented} role="group" aria-label="Select role">
          <button
            type="button"
            className={
              role === "issuer"
                ? `${styles.segBtn} ${styles.segBtnActive}`
                : styles.segBtn
            }
            onClick={() => setRole("issuer")}
            aria-pressed={role === "issuer"}
          >
            Issuer
          </button>
          <button
            type="button"
            className={
              role === "employer"
                ? `${styles.segBtn} ${styles.segBtnActive}`
                : styles.segBtn
            }
            onClick={() => setRole("employer")}
            aria-pressed={role === "employer"}
          >
            Employer
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
