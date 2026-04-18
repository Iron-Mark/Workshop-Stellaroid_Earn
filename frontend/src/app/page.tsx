import Link from "next/link";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
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
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <img src="/logo.svg" alt="" width={28} height={28} style={{ verticalAlign: "middle", marginRight: 10 }} />
            Stellaroid Earn
          </div>
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/app">Demo</Link>
            <Link href="/about">About</Link>
            <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <img
          src="/logo.svg"
          alt=""
          width={96}
          height={96}
          style={{ marginBottom: 20, imageRendering: "pixelated" }}
        />
        <span className={styles.eyebrow}>Stellar Testnet · Soroban · Freighter</span>
        <h1 className={styles.h1}>
          Prove your credentials.
          <br />
          <em>Get paid instantly.</em>
        </h1>
        <p className={styles.lede}>
          A Philippine bootcamp graduate registers a certificate hash on Stellar; an
          employer verifies it in seconds and pays the grad directly in XLM. Stellar&rsquo;s
          sub-cent fees make per-cert settlement viable.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/app" className={styles.ctaPrimary}>
            Try the demo →
          </Link>
          <a
            href={contractUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.ctaGhost}
          >
            View contract on stellar.expert
          </a>
        </div>
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
          <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>Proof</h2>
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            Live on Stellar testnet. Every event is public and verifiable.
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

      <footer className={styles.footer}>
        Built for the Stellar Philippines UniTour bootcamp ·{" "}
        <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </footer>
    </div>
  );
}
