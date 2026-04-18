import { ReactNode } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { CopyButton } from "@/components/ui";
import styles from "./app-shell.module.css";

interface AppShellProps {
  children: ReactNode;
  rpcPill?: ReactNode;
  walletButton?: ReactNode;
}

export function AppShell({ children, rpcPill, walletButton }: AppShellProps) {
  const contractId = appConfig.contractId;
  const explorerUrl = appConfig.explorerUrl;
  const shortenedContractId = contractId ? shortenAddress(contractId, 8) : "Not configured";
  const contractExplorerUrl = contractId
    ? `${explorerUrl}/contract/${contractId}`
    : explorerUrl;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <img src="/logo.svg" alt="" width={22} height={22} />
            Stellaroid Earn
          </Link>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/app">Demo</Link>
            <Link href="/about">About</Link>
          </nav>
          <div className={styles.headerRight}>
            {rpcPill}
            {walletButton}
          </div>
        </div>
        <div className={styles.subheader}>
          <span className={styles.subheaderLabel}>Contract</span>
          <code>{shortenedContractId}</code>
          {contractId && (
            <CopyButton value={contractId} ariaLabel="Copy contract ID" />
          )}
          <a
            href={contractExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.explorerLink}
          >
            stellar.expert ↗
          </a>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default AppShell;
