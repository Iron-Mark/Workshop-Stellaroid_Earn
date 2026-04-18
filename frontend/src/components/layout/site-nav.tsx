import Link from "next/link";
import styles from "./site-nav.module.css";

interface SiteNavProps {
  right?: React.ReactNode;
}

export function SiteNav({ right }: SiteNavProps) {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img src="/logo.svg" alt="" width={26} height={26} />
          <span>Stellaroid Earn</span>
        </Link>
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/app">Demo</Link>
          <Link href="/about">About</Link>
          <a
            href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
        {right && <div className={styles.right}>{right}</div>}
      </div>
    </nav>
  );
}
