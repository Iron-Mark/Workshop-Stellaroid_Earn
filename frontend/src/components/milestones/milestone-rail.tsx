export interface MilestoneState {
  registered: boolean;
  verified: boolean;
  paid: boolean;
}

export interface MilestoneRailProps {
  state: MilestoneState;
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M5.5 10.5L8.5 13.5L14.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="10"
        cy="10"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function ActiveCircleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <circle cx="10" cy="10" r="4" fill="currentColor" />
    </svg>
  );
}

type StepStatus = "done" | "active" | "pending";

function getStepStatus(
  stepIndex: number,
  states: boolean[],
): StepStatus {
  if (states[stepIndex]) return "done";
  // active = first step that isn't done
  const firstPending = states.findIndex((s) => !s);
  if (firstPending === stepIndex) return "active";
  return "pending";
}

interface StepProps {
  label: string;
  status: StepStatus;
}

function Step({ label, status }: StepProps) {
  const iconColorClass =
    status === "done"
      ? "text-verified [animation:pixelPop_280ms_cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:animate-none"
      : status === "active"
        ? "text-primary [animation:pulseRing_1.6s_ease-in-out_infinite] motion-reduce:animate-none"
        : "text-text-muted";

  const labelColorClass =
    status === "done"
      ? "text-verified"
      : status === "active"
        ? "text-primary"
        : "text-text-muted";

  const srStatus =
    status === "done" ? " (complete)" : status === "active" ? " (in progress)" : " (pending)";

  return (
    <div className="flex flex-col items-center gap-2 shrink-0 max-sm:flex-row max-sm:gap-3">
      <div
        className={[
          "w-11 h-11 flex items-center justify-center rounded-full",
          iconColorClass,
        ].join(" ")}
      >
        {status === "done" ? (
          <CheckIcon />
        ) : status === "active" ? (
          <ActiveCircleIcon />
        ) : (
          <EmptyCircleIcon />
        )}
      </div>
      <span
        className={[
          "font-mono text-[13px] font-medium text-center",
          labelColorClass,
        ].join(" ")}
      >
        {label}
        <span className="sr-only">{srStatus}</span>
      </span>
    </div>
  );
}

interface ConnectorProps {
  filled: boolean;
}

function Connector({ filled }: ConnectorProps) {
  return (
    <div
      className={[
        "flex-1 h-0.5 min-w-6 mb-5",
        "max-sm:w-0.5 max-sm:h-6 max-sm:min-w-0 max-sm:mb-0 max-sm:ml-[21px]",
        filled
          ? "bg-linear-to-r from-verified to-verified-strong max-sm:bg-linear-to-b"
          : "bg-border",
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

export function MilestoneRail({ state }: MilestoneRailProps) {
  const stepDone = [state.registered, state.verified, state.paid];

  const registeredStatus = getStepStatus(0, stepDone);
  const verifiedStatus = getStepStatus(1, stepDone);
  const paidStatus = getStepStatus(2, stepDone);

  return (
    <nav
      className="flex flex-row items-center gap-0 py-4 max-sm:flex-col max-sm:items-start"
      aria-label="Progress"
    >
      <Step label="Registered" status={registeredStatus} />
      <Connector filled={state.registered} />
      <Step label="Verified" status={verifiedStatus} />
      <Connector filled={state.verified} />
      <Step label="Paid" status={paidStatus} />
    </nav>
  );
}

export default MilestoneRail;
