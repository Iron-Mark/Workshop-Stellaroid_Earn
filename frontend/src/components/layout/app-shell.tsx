import { ReactNode } from "react";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { CopyButton } from "@/components/ui";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import styles from "./app-shell.module.css";

interface AppShellProps {
  children: ReactNode;
  rpcPill?: ReactNode;
  walletButton?: ReactNode;
}

export function AppShell({ children, rpcPill, walletButton }: AppShellProps) {
  const contractId = appConfig.contractId;
  const explorerUrl = appConfig.explorerUrl;
  const shortenedContractId = contractId
    ? shortenAddress(contractId, 8)
    : "Not configured";
  const contractExplorerUrl = contractId
    ? `${explorerUrl}/contract/${contractId}`
    : explorerUrl;

  return (
    <div className={styles.root}>
      <SiteNav
        right={
          <>
            {rpcPill}
            {walletButton}
          </>
        }
      />
      <div className={styles.subheader}>
        <div className={styles.subheaderInner}>
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
      </div>
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  );
}

export default AppShell;
