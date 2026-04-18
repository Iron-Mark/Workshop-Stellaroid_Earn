import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Network banner placeholder */}
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="grid [grid-template-columns:minmax(0,1.5fr)_minmax(280px,0.95fr)] gap-6 items-start max-[920px]:grid-cols-1">
          {/* Action column */}
          <div className="flex flex-col gap-6 min-w-0">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
          {/* Preview column */}
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </AppShell>
  );
}
