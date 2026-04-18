import Link from "next/link";
import { appConfig } from "@/lib/config";
import styles from "./page.module.css";

export default function About() {
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <Link href="/">
              <img
                src="/logo.svg"
                alt=""
                width={24}
                height={24}
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
              Stellaroid Earn
            </Link>
          </div>
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/app">Demo</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </nav>

      <article className={styles.article}>
        <header>
          <span className={styles.eyebrow}>About</span>
          <h1>Why Stellaroid Earn</h1>
        </header>

        <section>
          <h2>The problem</h2>
          <p>
            A graduating student from a Philippine bootcamp applying to a Singapore fintech
            waits two to three weeks for manual certificate verification by email. By then,
            ₱40,000 – ₱80,000 of contract work has gone to another candidate. Certificate
            fraud on LinkedIn makes remote hiring risky for employers too.
          </p>
        </section>

        <section>
          <h2>The approach</h2>
          <p>
            Bind a SHA-256 hash of the certificate PDF to the student&rsquo;s wallet on a
            Soroban smart contract. Any employer can verify the hash on-chain and trigger
            payment directly to the verified wallet — all in a single browser session.
          </p>
          <p>
            The canonical output isn&rsquo;t the UI — it&rsquo;s the <em>event stream on stellar.expert</em>.
            A reviewer without access to the frontend can still see every issuance,
            verification, and payment, provably.
          </p>
        </section>

        <section>
          <h2>Tech stack</h2>
          <ul>
            <li><strong>Contract:</strong> Rust + <code>soroban-sdk 22</code>, 5 passing unit tests</li>
            <li><strong>Deployment:</strong> Stellar testnet, initialized with native XLM SAC as reward token</li>
            <li><strong>Frontend:</strong> Next.js 15 App Router + React 19</li>
            <li><strong>Wallet:</strong> Freighter via <code>@stellar/freighter-api</code></li>
            <li><strong>Sign &amp; submit:</strong> <code>@stellar/stellar-sdk</code> with Soroban RPC</li>
            <li><strong>Hosting:</strong> Vercel (auto-deployed from <code>main</code>)</li>
          </ul>
        </section>

        <section>
          <h2>Contract surface</h2>
          <dl className={styles.dl}>
            <dt><code>init(admin, token)</code></dt>
            <dd>One-shot bootstrap. Stores admin + reward token in instance storage.</dd>

            <dt><code>register_certificate(issuer, student, cert_hash)</code></dt>
            <dd>Binds hash to student wallet; rejects duplicates; emits <code>cert_reg</code>.</dd>

            <dt><code>verify_certificate(cert_hash) → bool</code></dt>
            <dd>Flips record to verified; emits <code>cert_ver</code>.</dd>

            <dt><code>reward_student(student, cert_hash, amount)</code></dt>
            <dd>Admin-triggered XLM reward via the configured SAC.</dd>

            <dt><code>link_payment(employer, student, cert_hash, amount)</code></dt>
            <dd>Employer pays a verified student directly; emits <code>payment</code>.</dd>

            <dt><code>get_certificate(cert_hash)</code></dt>
            <dd>Read-only lookup of the certificate record.</dd>
          </dl>
        </section>

        <section>
          <h2>Credits</h2>
          <p>
            Built for the <a href="https://www.risein.com/programs" target="_blank" rel="noreferrer">Stellar Philippines UniTour</a>{" "}
            bootcamp in partnership with{" "}
            <a href="https://risein.com" target="_blank" rel="noreferrer">Rise In</a>.
            Source, contract, and Proof Block live at{" "}
            <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026" target="_blank" rel="noreferrer">
              github.com/Iron-Mark/Stellar-Bootcamp-2026
            </a>.
          </p>
          <p>
            Verify the deployed contract on{" "}
            <a href={contractUrl} target="_blank" rel="noreferrer">Stellar Expert</a>.
          </p>
        </section>

        <div className={styles.cta}>
          <Link href="/app" className={styles.ctaPrimary}>
            Try the demo →
          </Link>
        </div>
      </article>
    </div>
  );
}
