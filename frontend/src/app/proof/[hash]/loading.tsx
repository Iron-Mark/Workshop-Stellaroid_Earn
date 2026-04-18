import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import styles from "./loading.module.css";

export default function ProofLoading() {
  return (
    <>
      <SiteNav />
      <main id="main" style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <div className={styles.shell} aria-busy="true" aria-live="polite">
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <span className={`${styles.pill} ${styles.shimmer}`} style={{ width: 110 }} />
              <span className={`${styles.pill} ${styles.shimmer}`} style={{ width: 80 }} />
            </div>
            <div className={`${styles.line} ${styles.shimmer}`} style={{ width: "85%", height: 24 }} />
            <div className={styles.metaRow}>
              <span className={`${styles.label} ${styles.shimmer}`} style={{ width: 80 }} />
              <span className={`${styles.code} ${styles.shimmer}`} style={{ width: 180 }} />
            </div>
            <div className={styles.metaRow}>
              <span className={`${styles.label} ${styles.shimmer}`} style={{ width: 120 }} />
              <span className={`${styles.code} ${styles.shimmer}`} style={{ width: 220 }} />
            </div>
            <div className={styles.divider} />
            <div className={styles.certRow}>
              <span className={`${styles.label} ${styles.shimmer}`} style={{ width: 60 }} />
              <span className={`${styles.code} ${styles.shimmer}`} style={{ width: 160 }} />
            </div>
            <div className={styles.certRow}>
              <span className={`${styles.label} ${styles.shimmer}`} style={{ width: 60 }} />
              <span className={`${styles.code} ${styles.shimmer}`} style={{ width: 160 }} />
            </div>
            <div className={styles.certRow}>
              <span className={`${styles.label} ${styles.shimmer}`} style={{ width: 80 }} />
              <span className={`${styles.pill} ${styles.shimmer}`} style={{ width: 64 }} />
            </div>
            <div className={styles.divider} />
            <div className={styles.qrRow}>
              <div className={`${styles.qr} ${styles.shimmer}`} />
              <div className={styles.qrText}>
                <span className={`${styles.line} ${styles.shimmer}`} style={{ width: 140, height: 12 }} />
                <span className={`${styles.line} ${styles.shimmer}`} style={{ width: 200, height: 10 }} />
              </div>
            </div>
            <span className={styles.srOnly}>Loading proof block…</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
