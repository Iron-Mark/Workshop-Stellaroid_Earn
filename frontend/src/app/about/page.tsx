import Link from "next/link";
import { appConfig } from "@/lib/config";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import styles from "./page.module.css";

const stack = [
  {
    title: "Rust + soroban-sdk 22",
    desc: "Contract crate, 5 unit tests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M7 7l10 10M17 7L7 17" opacity="0.35" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Stellar testnet",
    desc: "Deployed + initialised with native SAC",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.09 9.26L21.5 9.27L15.45 13.77L17.77 21.02L12 16.5L6.23 21.02L8.55 13.77L2.5 9.27L9.91 9.26L12 2Z" />
      </svg>
    ),
  },
  {
    title: "Next.js 15 + React 19",
    desc: "App Router, server + client",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 6v12M16 6l-8 12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Freighter wallet",
    desc: "@stellar/freighter-api signing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
        <path d="M4 7V5a2 2 0 0 1 2-2h10" />
        <circle cx="16" cy="13" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "@stellar/stellar-sdk",
    desc: "Build, simulate, submit via Soroban RPC",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6L2 12l6 6M16 6l6 6-6 6M14 4l-4 16" />
      </svg>
    ),
  },
  {
    title: "Vercel",
    desc: "Auto-deployed from main",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L22 20H2L12 3Z" />
      </svg>
    ),
  },
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
            <h2>The friction costs more than the fraud</h2>
            <p>
              <strong>Maria graduated top of her bootcamp cohort in Quezon City.</strong>{" "}
              She applies to a Singapore fintech on a Tuesday. The employer emails her
              school to confirm the certificate. Three weeks later, the role is filled
              — by a candidate who didn&rsquo;t need verifying.
            </p>
            <p>
              Verification takes 14&ndash;21 days. 32% of candidates misrepresent their
              education. Background checks cost $30&ndash;$75 each. So employers default
              to the candidate they <em>can</em> vet cheaply &mdash; and Maria loses a
              job she earned.
            </p>
            <p>
              The certificate is real. The problem is that proving it costs more than
              hiring around it.
            </p>
          </article>

          <article className={styles.card}>
            <div className={styles.cardEyebrow}>The approach</div>
            <h2>Bind the hash. Pay the wallet. Prove the work.</h2>
            <p>
              Maria&rsquo;s school hashes her diploma and anchors it on Stellar. The
              Singapore employer verifies in 5 seconds, pays 500 XLM directly to her
              wallet &mdash; no invoice, no platform, no wait. The whole cycle takes
              less time than reading this paragraph.
            </p>
            <p>
              The canonical output isn&rsquo;t the UI — it&rsquo;s the{" "}
              <em>event stream on stellar.expert</em>. A reviewer with no frontend
              access still sees every issuance, verification, and payment. The proof is
              public by default.
            </p>
          </article>
        </div>

        <article className={styles.card} style={{ marginTop: 24 }}>
          <div className={styles.cardEyebrow}>What changes for Maria</div>
          <h2>Concrete wins, not abstract outcomes</h2>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7, color: "var(--color-text)" }}>
            <li>Gets paid the same day her work is verified &mdash; no 30-day invoice.</li>
            <li>Keeps 100% of the XLM &mdash; no 20% platform take rate.</li>
            <li>Has a public Proof Block URL she can drop into her next offer email.</li>
            <li>Can share verified work on LinkedIn with a pre-filled post and thumbnail.</li>
            <li>Owns her credential forever &mdash; no platform lock-in, no migration pain.</li>
          </ul>
        </article>

        <section className={styles.sectionWide}>
          <div className={styles.sectionHead}>
            <h2>Tech stack</h2>
            <p>Boring, proven, fast to demo.</p>
          </div>
          <div className={styles.stack}>
            {stack.map((s) => (
              <div key={s.title} className={styles.stackChip}>
                <div className={styles.stackIcon} aria-hidden="true">
                  {s.icon}
                </div>
                <div>
                  <p className={styles.stackChipTitle}>{s.title}</p>
                  <p className={styles.stackChipDesc}>{s.desc}</p>
                </div>
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
