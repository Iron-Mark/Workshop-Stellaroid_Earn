import Link from "next/link";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { RecentActivity } from "@/components/activity/recent-activity";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
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
  {
    value: "5/5",
    label: "Unit tests passing",
    category: "Tests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    value: "6",
    label: "Public functions",
    category: "Surface",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3" />
        <path d="M9 3h6v4H9z" />
      </svg>
    ),
  },
  {
    value: "5",
    label: "Event types",
    category: "On-chain",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    value: "<5s",
    label: "Testnet settlement",
    category: "Speed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const mariaWins = [
  {
    title: "Paid same day",
    body: "Payment clears the moment work is verified — no 30-day invoice, no net-terms.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Keeps 100% of XLM",
    body: "Direct wallet-to-wallet — no 20% platform take rate between the employer and Maria.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M9 10h4a2 2 0 0 1 0 4H9v-4zM9 14h5a2 2 0 0 1 0 4H9v-4z" />
      </svg>
    ),
  },
  {
    title: "Public Proof Block URL",
    body: "A shareable link she drops into her next offer email — verifiable without any login.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07L11 5" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07L13 19" />
      </svg>
    ),
  },
  {
    title: "One-click LinkedIn share",
    body: "Pre-filled post with thumbnail — verified work becomes a portfolio artifact.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
        <path d="M16 6l-4-4-4 4M12 2v14" />
      </svg>
    ),
  },
  {
    title: "Owns it forever",
    body: "Credential lives on Stellar — no platform lock-in, no migration pain if the tool shuts down.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const fnGroups = [
  {
    label: "Init",
    tone: "neutral" as const,
    fns: [
      {
        sig: "init(admin, token)",
        desc: "One-shot bootstrap. Stores admin + reward token in instance storage.",
      },
    ],
  },
  {
    label: "Write",
    tone: "primary" as const,
    fns: [
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
    ],
  },
  {
    label: "Read",
    tone: "accent" as const,
    fns: [
      {
        sig: "get_certificate(cert_hash)",
        desc: "Read-only lookup of the certificate record.",
      },
    ],
  },
];

const errors = [
  { code: "1", name: "AlreadyInitialized", copy: "Init called twice.", tone: "state" },
  { code: "2", name: "NotInitialized", copy: "Admin/token not set yet.", tone: "state" },
  { code: "3", name: "Unauthorized", copy: "Caller isn't allowed.", tone: "auth" },
  { code: "4", name: "AlreadyExists", copy: "Duplicate cert hash.", tone: "input" },
  { code: "5", name: "NotFound", copy: "Hash isn't registered.", tone: "input" },
  { code: "6", name: "InvalidAmount", copy: "Amount must be > 0.", tone: "input" },
];

export default function About() {
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <div className={styles.page}>
      <SiteNav />
      <main id="main">
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
          <RecentActivity className={styles.activityStrip} compact />
        </div>

        <div className={styles.container}>
        <dl className={styles.stats} aria-label="By the numbers">
          {stats.map((s) => (
            <div key={s.label} className={styles.statCell}>
              <div className={styles.statHead}>
                <span className={styles.statIcon} aria-hidden="true">{s.icon}</span>
                <span className={styles.statCategory}>{s.category}</span>
              </div>
              <dt className={styles.statValue}>{s.value}</dt>
              <dd className={styles.statLabel}>{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.twoUp}>
          <article className={`${styles.card} ${styles.storyCard}`}>
            <div className={styles.cardEyebrow}>The problem</div>
            <h2>The friction costs more than the fraud</h2>
            <p className={styles.storyIntro}>
              <strong>Maria graduated top of her bootcamp cohort in Quezon City.</strong>{" "}
              She applies to a Singapore fintech — and then the clock starts.
            </p>
            <ol className={`${styles.beatList} ${styles.beatListProblem}`}>
              <li className={styles.beat}>
                <span className={styles.beatIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 9h18M8 3v4M16 3v4" />
                  </svg>
                </span>
                <div>
                  <p className={styles.beatLabel}>Tuesday</p>
                  <p className={styles.beatBody}>Maria applies. Employer emails the school to confirm the certificate.</p>
                </div>
              </li>
              <li className={styles.beat}>
                <span className={styles.beatIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <div>
                  <p className={styles.beatLabel}>14–21 days</p>
                  <p className={styles.beatBody}>Verification drags. 32% of candidates misrepresent. Background checks cost $30–$75 each.</p>
                </div>
              </li>
              <li className={styles.beat}>
                <span className={styles.beatIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 8l8 8M16 8l-8 8" />
                  </svg>
                </span>
                <div>
                  <p className={styles.beatLabel}>Three weeks later</p>
                  <p className={styles.beatBody}>Role filled — by a candidate who didn&rsquo;t need verifying. Maria loses a job she earned.</p>
                </div>
              </li>
            </ol>
            <p className={styles.storyKicker}>
              The certificate is real. The problem is that proving it costs more than hiring around it.
            </p>
          </article>

          <article className={`${styles.card} ${styles.storyCard}`}>
            <div className={styles.cardEyebrow}>The approach</div>
            <h2>Bind the hash. Pay the wallet. Prove the work.</h2>
            <p className={styles.storyIntro}>
              Same Maria, same Tuesday — on Stellar. The whole cycle takes less time than reading this paragraph.
            </p>
            <ol className={`${styles.beatList} ${styles.beatListApproach}`}>
              <li className={styles.beat}>
                <span className={styles.beatIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7h16M4 12h16M4 17h10" />
                    <circle cx="19" cy="17" r="2" />
                  </svg>
                </span>
                <div>
                  <p className={styles.beatLabel}>Step 1 · Anchor</p>
                  <p className={styles.beatBody}>School hashes Maria&rsquo;s diploma and anchors it on Stellar testnet.</p>
                </div>
              </li>
              <li className={styles.beat}>
                <span className={styles.beatIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <p className={styles.beatLabel}>Step 2 · Verify in 5s</p>
                  <p className={styles.beatBody}>Singapore employer queries the contract, gets an on-chain yes — no email thread.</p>
                </div>
              </li>
              <li className={styles.beat}>
                <span className={styles.beatIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v14M6 11l6 6 6-6" />
                    <path d="M4 21h16" />
                  </svg>
                </span>
                <div>
                  <p className={styles.beatLabel}>Step 3 · Pay</p>
                  <p className={styles.beatBody}>500 XLM lands in Maria&rsquo;s wallet — no invoice, no platform, no 30-day wait.</p>
                </div>
              </li>
            </ol>
            <p className={styles.storyKicker}>
              The canonical output isn&rsquo;t the UI — it&rsquo;s the <em>event stream on stellar.expert</em>. The proof is public by default.
            </p>
          </article>
        </div>

        <article className={styles.card} style={{ marginTop: 24 }}>
          <div className={styles.cardEyebrow}>What changes for Maria</div>
          <h2>Concrete wins, not abstract outcomes</h2>
          <ul className={styles.winGrid} role="list">
            {mariaWins.map((w) => (
              <li key={w.title} className={styles.winItem}>
                <span className={styles.winIcon} aria-hidden="true">{w.icon}</span>
                <div>
                  <p className={styles.winTitle}>{w.title}</p>
                  <p className={styles.winBody}>{w.body}</p>
                </div>
              </li>
            ))}
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
          <div className={styles.fnGroups}>
            {fnGroups.map((g) => (
              <div key={g.label} className={styles.fnGroup}>
                <div className={`${styles.fnGroupHead} ${styles[`fnTone_${g.tone}`]}`}>
                  <span className={styles.fnGroupBadge}>{g.label}</span>
                  <span className={styles.fnGroupCount}>
                    {g.fns.length} {g.fns.length === 1 ? "function" : "functions"}
                  </span>
                </div>
                <div className={styles.fnList}>
                  {g.fns.map((fn) => (
                    <div key={fn.sig} className={styles.fnRow}>
                      <div className={styles.fnSig}>{fn.sig}</div>
                      <p className={styles.fnDesc}>{fn.desc}</p>
                    </div>
                  ))}
                </div>
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
                <div className={styles.errMeta}>
                  <span
                    className={`${styles.errCode} ${styles[`errTone_${e.tone}`]}`}
                    aria-label={`Error ${e.code}`}
                  >
                    #{e.code}
                  </span>
                  <span
                    className={`${styles.errCategory} ${styles[`errTone_${e.tone}`]}`}
                  >
                    {e.tone}
                  </span>
                </div>
                <div>
                  <p className={styles.errName}>{e.name}</p>
                  <p className={styles.errCopy}>{e.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.credits} aria-label="Deployment receipt">
          <header className={styles.creditsHeader}>
            <div className={styles.creditsBrand}>
              <img src="/logo.svg" alt="" width={32} height={32} />
              <div>
                <p className={styles.creditsTitle}>Stellaroid Earn</p>
                <p className={styles.creditsSubtitle}>
                  Stellar Philippines UniTour · in partnership with{" "}
                  <a href="https://risein.com" target="_blank" rel="noreferrer">Rise In</a>
                </p>
              </div>
            </div>
            <div className={styles.creditsBadges}>
              <Badge tone="accent">Stellar testnet</Badge>
              <Badge tone="verified" dot>Deployed</Badge>
            </div>
          </header>

          <dl className={styles.creditsGrid}>
            <div className={styles.creditsRow}>
              <dt>Contract ID</dt>
              <dd>
                <code>{appConfig.contractId ? shortenAddress(appConfig.contractId, 8) : "—"}</code>
                {appConfig.contractId ? (
                  <CopyButton value={appConfig.contractId} ariaLabel="Copy contract ID" />
                ) : null}
                <a href={contractUrl} target="_blank" rel="noreferrer" className={styles.creditsLink}>
                  stellar.expert ↗
                </a>
              </dd>
            </div>
            <div className={styles.creditsRow}>
              <dt>Source</dt>
              <dd>
                <a
                  href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.creditsLink}
                >
                  GitHub ↗
                </a>
                <a
                  href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026/tree/main/contract"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.creditsLink}
                >
                  Contract crate ↗
                </a>
              </dd>
            </div>
            <div className={styles.creditsRow}>
              <dt>Network</dt>
              <dd>
                <code>Testnet · Soroban RPC</code>
              </dd>
            </div>
          </dl>
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
      </main>

      <SiteFooter />
    </div>
  );
}
