import Link from "next/link";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import styles from "./page.module.css";

const liveTxs = [
  {
    label: "init",
    hash: "c7de2d61cfd1f51cfb255379775dd928604d264d6b5bb3775dc75cdd7c4b5721",
    note: "contract bootstrapped with admin + native XLM SAC",
  },
  {
    label: "cert_reg",
    hash: "1e8078e36333023c46f11a0bd990f97b62bd13ae086597de6a3db8e66d4b3a22",
    note: "certificate hash registered against student wallet",
  },
  {
    label: "cert_ver",
    hash: "2215e08ecc935b6f31d5c335c3aaea3e3742f07ef993d8ca947d1711ad5199d9",
    note: "flipped to verified, emitted indexable event",
  },
  {
    label: "payment",
    hash: "5bed652b3725a6826cd4a99e8c750cdd2dc4625f7e3a4a82661680ada50cb435",
    note: "100 XLM transferred employer → verified grad",
  },
];

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

      <section className={styles.hero}>
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
          <Link
            href="/proof/1e8078e36333023c46f11a0bd990f97b62bd13ae086597de6a3db8e66d4b3a22"
            className={styles.ctaGhost}
          >
            See a sample Proof Block — no wallet needed
          </Link>
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

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Already on-chain</h2>
          <p>
            Not a mockup — the contract is live with real events. Click any hash to verify.
          </p>
        </div>
        <div className={styles.txList}>
          {liveTxs.map((tx) => (
            <a
              key={tx.hash}
              href={`${appConfig.explorerUrl}/tx/${tx.hash}`}
              target="_blank"
              rel="noreferrer"
              className={styles.txRow}
            >
              <span className={styles.txLabel}>{tx.label}</span>
              <code className={styles.txHash}>{tx.hash.slice(0, 10)}…{tx.hash.slice(-6)}</code>
              <span className={styles.txNote}>{tx.note}</span>
              <span className={styles.txArrow}>↗</span>
            </a>
          ))}
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

      <SiteFooter />
    </div>
  );
}
