"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

interface StatDialogProps {
  value: string;
  label: string;
  category: string;
  icon: ReactNode;
  scrollTo?: string;
  detail?: {
    title: string;
    description: string;
    items: { name: string; why: string; tone: "pass" | "guard" | "flow" }[];
  };
}

const toneBorder: Record<string, string> = {
  pass: "border-l-[#22C55E]",
  guard: "border-l-accent",
  flow: "border-l-primary",
};


const cellClass = "flex flex-col gap-1.5 px-5 py-5.5 border-r border-border last:border-r-0 max-sm:odd:border-r max-sm:border-b max-sm:nth-[n+3]:border-b-0";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function StatCard({ value, label, category, icon, scrollTo, detail }: StatDialogProps) {
  const content = (
    <>
      <div className="inline-flex items-center gap-2 text-text-muted">
        <span
          className="w-5.5 h-5.5 inline-flex items-center justify-center text-primary [&_svg]:w-4 [&_svg]:h-4"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="font-pixel text-[10.5px] font-semibold tracking-[0.12em] uppercase">
          {category}
        </span>
      </div>
      <dt className="font-mono text-[1.75rem] font-semibold text-primary tracking-tight m-0">
        {value}
      </dt>
      <dd className="text-xs text-text-muted m-0">{label}</dd>
    </>
  );

  if (!detail) {
    return (
      <button
        type="button"
        className={`${cellClass} text-left cursor-pointer hover:bg-surface-2 transition-colors`}
        onClick={() => scrollTo && scrollToSection(scrollTo)}
      >
        {content}
      </button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className={`${cellClass} text-left cursor-pointer hover:bg-surface-2 transition-colors`}>
        {content}
      </DialogTrigger>
      <DialogContent className="!max-w-md !bg-surface !border-none !ring-0 !max-h-[85vh] !overflow-y-auto !my-8 !p-6 !pt-8 !shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg">{detail.title}</DialogTitle>
          <DialogDescription>{detail.description}</DialogDescription>
        </DialogHeader>
        <ol className="flex flex-col gap-2.5 mt-2 list-none p-0 m-0">
          {detail.items.map((item, i) => (
            <li
              key={i}
              className={`bg-surface-2 border-0 border-l-[3px] rounded-lg px-4 py-3 ${toneBorder[item.tone]}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] font-bold text-primary bg-[rgba(245,158,11,0.1)] w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-text text-sm font-semibold font-mono">{item.name}</span>
              </div>
              <p className="text-text-muted text-[13px] leading-relaxed m-0 pl-7">{item.why}</p>
            </li>
          ))}
        </ol>
        <div className="flex gap-3 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> Happy path
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="w-2 h-2 rounded-full bg-accent" /> Guard rail
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
            <span className="w-2 h-2 rounded-full bg-primary" /> Full flow
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
