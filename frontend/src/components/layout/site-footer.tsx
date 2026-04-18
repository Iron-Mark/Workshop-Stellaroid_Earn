import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/lib/config";
import { FooterTagline } from "@/components/layout/footer-tagline";
import { LocaleToggle } from "@/components/layout/locale-toggle";

export function SiteFooter() {
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <footer className="border-t border-border-glass bg-surface-glass px-6 py-10 mt-20">
      <div className="max-w-[1040px] mx-auto flex flex-wrap gap-10 justify-between">
        {/* Brand block */}
        <div className="flex flex-col gap-3 min-w-[180px]">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="" width={24} height={24} />
            <span className="font-heading text-text font-semibold text-[15px]">Stellaroid Earn</span>
          </div>
          <div className="text-[13px] text-text-muted leading-relaxed">
            <FooterTagline />
          </div>
        </div>

        {/* Site links */}
        <div className="flex flex-col gap-2 text-[13px]">
          <h4 className="text-text font-semibold text-[13px] mb-1">Site</h4>
          <Link href="/" className="text-text-muted hover:text-text transition-colors no-underline">Home</Link>
          <Link href="/app" className="text-text-muted hover:text-text transition-colors no-underline">Demo</Link>
          <Link href="/about" className="text-text-muted hover:text-text transition-colors no-underline">About</Link>
        </div>

        {/* On-chain links */}
        <div className="flex flex-col gap-2 text-[13px]">
          <h4 className="text-text font-semibold text-[13px] mb-1">On-chain</h4>
          <a href={contractUrl} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors no-underline">
            Contract on stellar.expert ↗
          </a>
          <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors no-underline">
            Testnet explorer ↗
          </a>
          <a href="https://developers.stellar.org" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors no-underline">
            Stellar docs ↗
          </a>
        </div>

        {/* Source links */}
        <div className="flex flex-col gap-2 text-[13px]">
          <h4 className="text-text font-semibold text-[13px] mb-1">Source</h4>
          <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition-colors no-underline">
            GitHub ↗
          </a>
          <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026/tree/main/contract" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition-colors no-underline">
            Contract crate ↗
          </a>
          <a href="https://risein.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition-colors no-underline">
            Rise In ↗
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1040px] mx-auto mt-8 pt-6 border-t border-border-glass flex flex-wrap items-center justify-between gap-3 text-[12px] text-text-muted/60">
        <span>© Stellar Philippines UniTour · {new Date().getFullYear()}</span>
        <LocaleToggle />
      </div>
    </footer>
  );
}
