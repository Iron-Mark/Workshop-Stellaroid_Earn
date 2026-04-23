interface MilestoneStepperProps {
  milestoneCount: number;
  currentMilestone: number;
  status: string;
}

export function MilestoneStepper({
  milestoneCount,
  currentMilestone,
  status,
}: MilestoneStepperProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-pixel text-xs font-medium text-text-muted uppercase tracking-wider">
        Milestone progress
      </span>
      <div className="flex gap-2 items-center flex-wrap">
        {Array.from({ length: milestoneCount }, (_, i) => {
          const done = i < currentMilestone;
          const current = i === currentMilestone && status !== "released" && status !== "refunded";
          return (
            <div
              key={i}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border-2 transition-colors ${
                done
                  ? "border-success bg-success text-on-primary"
                  : current
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface-2 text-text-muted"
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-text-muted">
        {currentMilestone} of {milestoneCount} milestone{milestoneCount > 1 ? "s" : ""} completed
      </p>
    </div>
  );
}
