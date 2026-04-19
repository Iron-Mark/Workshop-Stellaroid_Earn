import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { appConfig } from "@/lib/config";
import { FooterTagline } from "@/components/layout/footer-tagline";
import { LocaleToggle } from "@/components/layout/locale-toggle";

export function SiteFooter() {
  const contractUrl = appConfig.contractId
    ? `${appConfig.explorerUrl}/contract/${appConfig.contractId}`
    : appConfig.explorerUrl;

  return (
    <footer className={[
      "relative mt-20 overflow-hidden",
      "border-t border-border-glass bg-surface-glass",
      /* amber hairline at top — mirrors the nav hairline */
      "before:absolute before:inset-x-0 before:top-0 before:h-px",
      "before:bg-linear-to-r before:from-transparent before:via-primary/60 before:to-transparent",
    ].join(" ")}>

      {/* Ambient horizon glow */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-40"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,158,11,0.07), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1040px] mx-auto px-6 py-12">
        {/* Columns */}
        <div className="flex flex-wrap gap-10 justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-4 min-w-[200px] max-w-[280px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 no-underline hover:opacity-80 transition-opacity"
            >
              <Image src="/logo.svg" alt="" width={26} height={26} />
              <span className="font-heading text-text font-semibold text-[15px]">Stellaroid Earn</span>
            </Link>
            <div className="text-[13px] text-text-muted leading-relaxed">
              <FooterTagline />
            </div>
          </div>

          {/* Site */}
          <nav aria-label="Site links" className="flex flex-col gap-2.5 text-[13px]">
            <p className="font-pixel text-[10px] font-medium text-text-muted uppercase tracking-widest mb-0.5">Site</p>
            <Link href="/"      className="text-text-muted hover:text-text transition-colors no-underline">Home</Link>
            <Link href="/app"   className="text-text-muted hover:text-text transition-colors no-underline">App</Link>
            <Link href="/proof" className="text-text-muted hover:text-text transition-colors no-underline">Verify</Link>
            <Link href="/about" className="text-text-muted hover:text-text transition-colors no-underline">About</Link>
          </nav>

          {/* On-chain */}
          <div className="flex flex-col gap-2.5 text-[13px]">
            <p className="font-pixel text-[10px] font-medium text-text-muted uppercase tracking-widest mb-0.5">On-chain</p>
            <a href={contractUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-primary transition-colors no-underline">
              Contract on stellar.expert <ExternalLink className="w-3 h-3 shrink-0 opacity-50" aria-hidden="true" />
            </a>
            <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-primary transition-colors no-underline">
              Testnet explorer <ExternalLink className="w-3 h-3 shrink-0 opacity-50" aria-hidden="true" />
            </a>
            <a href="https://developers.stellar.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-primary transition-colors no-underline">
              Stellar docs <ExternalLink className="w-3 h-3 shrink-0 opacity-50" aria-hidden="true" />
            </a>
          </div>

          {/* Source */}
          <div className="flex flex-col gap-2.5 text-[13px]">
            <p className="font-pixel text-[10px] font-medium text-text-muted uppercase tracking-widest mb-0.5">Source</p>
            <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-text transition-colors no-underline">
              GitHub <ExternalLink className="w-3 h-3 shrink-0 opacity-50" aria-hidden="true" />
            </a>
            <a href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026/tree/main/contract" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-text transition-colors no-underline">
              Contract crate <ExternalLink className="w-3 h-3 shrink-0 opacity-50" aria-hidden="true" />
            </a>
            <a href="https://risein.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-text-muted hover:text-text transition-colors no-underline">
              Rise In <ExternalLink className="w-3 h-3 shrink-0 opacity-50" aria-hidden="true" />
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-border-glass flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-text-muted/60 font-mono tracking-wide">
            © Stellar PH Bootcamp · {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="https://www.linkedin.com/in/mark-siazon/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-text-muted/60 hover:text-primary transition-colors no-underline"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              Developed by Mark Siazon
            </a>
            <span className="font-pixel text-[10px] text-text-muted/40 uppercase tracking-widest">
              Built on Stellar testnet
            </span>
            <LocaleToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
