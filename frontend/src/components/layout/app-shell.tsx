import { ReactNode } from "react";
import { appConfig } from "@/lib/config";
import { shortenAddress } from "@/lib/format";
import { CopyButton } from "@/components/ui";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

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
    <div className="min-h-dvh flex flex-col bg-bg">
      <SiteNav />

      {/* Contract subheader */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-[1040px] mx-auto px-7 py-2 flex items-center gap-2 text-[13px] text-text-muted flex-wrap max-sm:px-[18px]">
          <span>Contract</span>
          <code className="font-mono text-[13px] text-text bg-surface-2 px-1 py-0.5 rounded">
            {shortenedContractId}
          </code>
          {contractId && (
            <CopyButton value={contractId} ariaLabel="Copy contract ID" />
          )}
          <a
            href={contractExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-text no-underline text-[13px] inline-flex items-center gap-0.5 transition-colors focus-visible:outline-primary rounded-sm"
          >
            stellar.expert ↗
          </a>
          {rpcPill}
          {walletButton}
        </div>
      </div>

      <main id="main" className="flex-1 max-w-[1040px] w-full mx-auto px-7 py-6 max-sm:px-[18px]">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}

export default AppShell;
