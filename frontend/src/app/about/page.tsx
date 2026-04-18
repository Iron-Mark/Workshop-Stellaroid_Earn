import Link from "next/link";
import { appConfig } from "@/lib/config";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import styles from "./page.module.css";

const stack = [
  { title: "Rust + soroban-sdk 22", desc: "Contract crate, 5 unit tests" },
  { title: "Stellar testnet", desc: "Deployed + initialised with native SAC" },
  { title: "Next.js 15 + React 19", desc: "App Router, server + client" },
  { title: "Freighter wallet", desc: "@stellar/freighter-api signing" },
  { title: "@stellar/stellar-sdk", desc: "Build, simulate, submit via Soroban RPC" },
  { title: "Vercel", desc: "Auto-deployed from main" },
];

const stats = [
  { value: "5/5", label: "Unit tests passing" },
  { value: "6", label: "Public contract functions" },
  { value: "5", label: "Event types on-chain" },
  { value: "<5s", label: "Testnet settlement" },
];

const errors = [
  { code: "1", name: "AlreadyInitialized", copy: "Init called twice." },
  { code: "2", name: "NotInitialized", copy: "Admin/token not set yet." },
  { code: "3", name: "Unauthorized", copy: "Caller isn't allowed." },
  { code: "4", name: "AlreadyExists", copy: "Duplicate cert hash." },
  { code: "5", name: "NotFound", copy: "Hash isn't registered." },
  { code: "6", name: "InvalidAmount", copy: "Amount must be > 0." },
];

const fns = [
  {
    sig: "init(admin, token)",
    desc: "One-shot bootstrap. Stores admin + reward token in instance storage.",
  },
  {
    sig: "register_certificate(issuer, student, cert_hash)",
    desc: "Binds hash to student wallet; rejects duplicates; emits cert_reg.",
  },
  {
    sig: "verify_certificate(cert_hash) → bool",
    desc: "Flips record to verified; emits cert_ver.",
  },
  {
    sig: "reward_student(student, cert_hash, amount)",
    desc: "Admin-triggered XLM reward via the configured SAC.",
  },
  {
    sig: "link_payment(employer, student, cert_hash, amount)",
    desc: "Employer pays a verified student directly; emits payment.",
  },
  {
    sig: "get_certificate(cert_hash)",
    desc: "Read-only lookup of the certificate record.",
  },
];

export default function About() {
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <div className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>About</span>
        <h1>
          Why <em>Stellaroid Earn</em>
        </h1>
        <p className={styles.lede}>
          A thin piece of software around one idea: certificates should be
          verifiable in seconds, not emails. And if they&rsquo;re verifiable, the grad
          should get paid on the same tap.
        </p>
      </section>

      <div className={styles.container}>
        <dl className={styles.stats} aria-label="By the numbers">
          {stats.map((s) => (
            <div key={s.label} className={styles.statCell}>
              <dt className={styles.statValue}>{s.value}</dt>
              <dd className={styles.statLabel}>{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.twoUp}>
          <article className={styles.card}>
            <div className={styles.cardEyebrow}>The problem</div>
            <h2>Verification is the bottleneck</h2>
            <p>
              A graduating student from a Philippine bootcamp applies to a Singapore
              fintech. The employer emails the school to confirm the certificate. Two to
              three weeks later, the slot is filled by someone who didn&rsquo;t need
              verification.
            </p>
            <p>
              Meanwhile, LinkedIn fraud makes employers cautious about remote hires
              they can&rsquo;t vet cheaply. Both sides lose.
            </p>
          </article>

          <article className={styles.card}>
            <div className={styles.cardEyebrow}>The approach</div>
            <h2>Bind the hash, pay the wallet</h2>
            <p>
              Hash the certificate PDF, anchor the hash + student wallet on Soroban,
              let any employer verify + pay in one session.
            </p>
            <p>
              The canonical output isn&rsquo;t the UI — it&rsquo;s the{" "}
              <em>event stream on stellar.expert</em>. A reviewer with no frontend access
              can still see every issuance, verification, and payment, provably.
            </p>
          </article>
        </div>

        <section className={styles.sectionWide}>
          <div className={styles.sectionHead}>
            <h2>Tech stack</h2>
            <p>Boring, proven, fast to demo.</p>
          </div>
          <div className={styles.stack}>
            {stack.map((s) => (
              <div key={s.title} className={styles.stackChip}>
                <p className={styles.stackChipTitle}>{s.title}</p>
                <p className={styles.stackChipDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionWide}>
          <div className={styles.sectionHead}>
            <h2>Contract surface</h2>
            <p>Six public functions; storage explicit; errors human.</p>
          </div>
          <div className={styles.fnList}>
            {fns.map((fn) => (
              <div key={fn.sig} className={styles.fnRow}>
                <div className={styles.fnSig}>{fn.sig}</div>
                <p className={styles.fnDesc}>{fn.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionWide}>
          <div className={styles.sectionHead}>
            <h2>Errors are human</h2>
            <p>
              No raw <code>ScVal</code> or <code>HostError</code> reaches the UI — every
              contract error maps to a sentence a reviewer can read.
            </p>
          </div>
          <div className={styles.errGrid}>
            {errors.map((e) => (
              <div key={e.code} className={styles.errCell}>
                <span className={styles.errCode}>#{e.code}</span>
                <div>
                  <p className={styles.errName}>{e.name}</p>
                  <p className={styles.errCopy}>{e.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.credits}>
          <img src="/logo.svg" alt="" width={64} height={64} />
          <div>
            <h3>Built for the Stellar Philippines UniTour</h3>
            <p>
              In partnership with{" "}
              <a href="https://risein.com" target="_blank" rel="noreferrer">
                Rise In
              </a>
              . Source, contract, and Proof Block live on{" "}
              <a
                href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              . The deployed contract is verifiable on{" "}
              <a href={contractUrl} target="_blank" rel="noreferrer">
                Stellar Expert
              </a>
              .
            </p>
          </div>
        </aside>

        <div className={styles.ctaRow}>
          <Link href="/app" className={styles.ctaPrimary}>
            Try the demo →
          </Link>
          <Link href="/proof" className={styles.ctaGhost}>
            Look up a certificate
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
