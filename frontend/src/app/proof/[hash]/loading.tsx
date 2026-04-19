import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProofLoading() {
  return (
    <>
      <SiteNav />
      <main id="main" className="max-w-[720px] mx-auto px-6 py-12">
        <div aria-busy="true" aria-live="polite">
          <article className="relative overflow-hidden bg-surface border border-border rounded-2xl flex flex-col gap-4 p-8 max-sm:p-5 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-linear-to-r before:from-primary before:to-accent before:opacity-40">
            {/* Badge row */}
            <div className="flex gap-2">
              <Skeleton className="h-[22px] w-[110px] rounded-full" />
              <Skeleton className="h-[22px] w-20 rounded-full" />
            </div>
            {/* Title */}
            <Skeleton className="h-6 w-[85%]" />
            {/* Meta rows */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-[10px] w-20 rounded-[3px]" />
              <Skeleton className="h-[22px] w-[180px] rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-[10px] w-[120px] rounded-[3px]" />
              <Skeleton className="h-[22px] w-[220px] rounded" />
            </div>
            <div className="h-px bg-border my-1" />
            {/* Cert rows */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-[10px] w-[60px] rounded-[3px]" />
              <Skeleton className="h-[22px] w-[160px] rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-[10px] w-[60px] rounded-[3px]" />
              <Skeleton className="h-[22px] w-[160px] rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-[10px] w-20 rounded-[3px]" />
              <Skeleton className="h-[22px] w-16 rounded-full" />
            </div>
            <div className="h-px bg-border my-1" />
            {/* QR row */}
            <div className="flex gap-4 items-center pt-3 border-t border-border">
              <Skeleton className="w-24 h-24 rounded-md shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-[140px]" />
                <Skeleton className="h-2.5 w-[200px]" />
              </div>
            </div>
            <span className="sr-only">Loading proof block…</span>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
