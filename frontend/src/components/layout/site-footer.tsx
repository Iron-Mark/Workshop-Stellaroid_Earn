import Link from "next/link";
import { appConfig } from "@/lib/config";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <div className={styles.brandRow}>
            <img src="/logo-mono.svg" alt="" width={24} height={24} />
            <span>Stellaroid Earn</span>
          </div>
          <p>
            On-chain credential registry on Stellar testnet. Built for the Stellar
            Philippines UniTour bootcamp.
          </p>
        </div>
        <div className={styles.col}>
          <h4>Site</h4>
          <Link href="/">Home</Link>
          <Link href="/app">Demo</Link>
          <Link href="/about">About</Link>
        </div>
        <div className={styles.col}>
          <h4>On-chain</h4>
          <a href={contractUrl} target="_blank" rel="noreferrer">
            Contract on stellar.expert ↗
          </a>
          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noreferrer"
          >
            Testnet explorer ↗
          </a>
          <a
            href="https://developers.stellar.org"
            target="_blank"
            rel="noreferrer"
          >
            Stellar docs ↗
          </a>
        </div>
        <div className={styles.col}>
          <h4>Source</h4>
          <a
            href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026/tree/main/contract"
            target="_blank"
            rel="noreferrer"
          >
            Contract crate ↗
          </a>
          <a
            href="https://risein.com"
            target="_blank"
            rel="noreferrer"
          >
            Rise In ↗
          </a>
        </div>
      </div>
      <div className={styles.bottom}>
        © Stellar Philippines UniTour · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
