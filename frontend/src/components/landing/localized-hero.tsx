// frontend/src/components/landing/localized-hero.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { DEFAULT_SAMPLE_PROOF_HASH } from "@/lib/demo-data";
import { useLocale } from "@/hooks/use-locale";
import { i18n } from "@/lib/i18n";

interface LocalizedHeroProps {
  className?: string;
}

export function LocalizedHero({ className }: LocalizedHeroProps) {
  const locale = useLocale();
  const t = i18n[locale].hero;

  return (
    <section className={cn("px-6 py-24 sm:px-0 sm:py-[96px] sm:pb-16 max-w-[960px] mx-auto text-center", className)}>
      <span className="inline-block font-pixel text-xs tracking-widest uppercase text-primary border border-amber-500/30 bg-amber-500/8 px-3 py-1 rounded-full mb-5">
        {t.eyebrow}
      </span>
      <h1 className="text-4xl sm:text-7xl leading-tight -tracking-wide font-bold m-0 mb-5">
        {t.h1a}
        <br />
        <em className="not-italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t.h1b}</em>
      </h1>
      <p className="text-base sm:text-lg text-text-muted max-w-[640px] mx-auto mb-8 leading-[1.55]">
        {t.lede}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href="/app"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-base no-underline",
            "bg-primary text-on-primary border border-primary shadow-lg shadow-amber-500/15",
            "hover:bg-primary-hover hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-0.5",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-1",
            "transition-all duration-150 ease-out",
            "motion-safe:hover:translate-y-[-1px] motion-reduce:hover:translate-y-0"
          )}
        >
          {t.ctaPrimary}
        </Link>
        <Link
          href={`/proof/${DEFAULT_SAMPLE_PROOF_HASH}`}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-base no-underline",
            "text-text border border-border bg-transparent",
            "hover:bg-surface hover:-translate-y-0.5",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-1",
            "transition-all duration-150 ease-out",
            "motion-safe:hover:translate-y-[-1px] motion-reduce:hover:translate-y-0"
          )}
        >
          {t.ctaGhost}
        </Link>
      </div>
      <img
        src="/illust-hero.svg"
        alt="Register, verify, and pay flow"
        width={560}
        height={187}
        className="block max-w-full h-auto mx-auto mt-12 sm:mt-12 sm:[image-rendering:pixelated]"
      />
    </section>
  );
}

export default LocalizedHero;
