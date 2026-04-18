import Link from "next/link";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { RecentActivity } from "@/components/activity/recent-activity";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { LocalizedHero } from "@/components/landing/localized-hero";
import styles from "./page.module.css";

export default function Landing() {
  const contractShort = appConfig.contractId
    ? shortenAddress(appConfig.contractId, 8)
    : "not configured";
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <div className={styles.page}>
      <SiteNav />
      <main id="main">
        <LocalizedHero />

        <section className={styles.section}>
          <RecentActivity />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>How it works</h2>
            <p>Three on-chain actions. Everything indexable on Stellar Expert.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Issuer registers a certificate</h3>
              <p>
                A school or bootcamp drops a PDF, the browser computes its SHA-256 hash, and
                the issuer signs <code>register_certificate</code> binding the hash to the
                student&rsquo;s wallet. Duplicate hashes are rejected on-chain.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Employer verifies</h3>
              <p>
                An employer calls <code>verify_certificate</code> with the hash. The contract
                flips the record to <code>verified = true</code> and emits{" "}
                <code>cert_ver</code> — proof anyone can audit on stellar.expert.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Employer pays the grad</h3>
              <p>
                <code>link_payment</code> transfers XLM via the native SAC directly to the
                student&rsquo;s verified wallet. Settlement is typically under five seconds and
                costs a fraction of a centavo.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.proofBanner}>
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>Proof block</h2>
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              Public, verifiable, no wallet required.
            </p>
          </div>
          <dl className={styles.proofRow}>
            <dt>Contract</dt>
            <dd>
              <a href={contractUrl} target="_blank" rel="noreferrer">
                {contractShort} ↗
              </a>
            </dd>
            <dt>Network</dt>
            <dd>{appConfig.network}</dd>
            <dt>Reward token</dt>
            <dd>{appConfig.assetCode} (native SAC)</dd>
            <dt>Demo</dt>
            <dd>
              <Link href="/app">stellaroid-earn-demo.vercel.app/app</Link>
            </dd>
          </dl>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
