// frontend/src/components/layout/site-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, GitFork } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/proof", label: "Verify" },
  { href: "/issuer", label: "Issuer" },
  { href: "/app", label: "App" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href="#main"
        className="absolute left-4 -top-12 z-[11] focus:top-3 px-3 py-2 rounded-md bg-primary text-on-primary font-semibold text-sm transition-[top] no-underline"
      >
        Skip to content
      </a>

      {/* Glassmorphism nav */}
      <nav
        className={cn(
          "sticky top-0 z-10",
          "border-b border-border-glass",
          "backdrop-blur-xl bg-surface-glass",
          /* amber hairline top edge */
          "before:absolute before:inset-x-0 before:top-0 before:h-px",
          "before:bg-gradient-to-r before:from-transparent before:via-primary/60 before:to-transparent",
          "relative"
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-7 py-4 gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-text no-underline font-bold text-[17px] tracking-[-0.2px] shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-primary"
          >
            <Image src="/logo.svg" alt="" width={28} height={28} />
            <span className="font-heading">Stellaroid Earn</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-6 text-sm flex-1 ml-6">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-text-muted hover:text-text no-underline transition-colors focus-visible:outline-primary rounded-sm"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <Button
              href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026"
              variant="outline"
              size="sm"
            >
              <GitFork className="w-3.5 h-3.5" />
              GitHub
            </Button>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border text-text bg-transparent cursor-pointer hover:bg-surface-2 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-[65px] bottom-0 z-20 bg-bg flex flex-col gap-1 p-6 md:hidden">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3.5 text-text text-[17px] border-b border-border no-underline hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Button href="https://github.com/Iron-Mark/Stellar-Bootcamp-2026" variant="outline" size="sm">
              <GitFork className="w-3.5 h-3.5" />
              GitHub
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
