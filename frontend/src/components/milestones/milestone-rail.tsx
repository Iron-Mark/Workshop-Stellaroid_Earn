import styles from "./milestone-rail.module.css";

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
  const iconClass =
    status === "done"
      ? styles.iconDone
      : status === "active"
        ? styles.iconActive
        : styles.iconPending;

  const labelClass =
    status === "done"
      ? styles.labelDone
      : status === "active"
        ? styles.labelActive
        : styles.labelPending;

  const srStatus =
    status === "done" ? " (complete)" : status === "active" ? " (in progress)" : " (pending)";

  return (
    <div className={styles.step}>
      <div className={`${styles.icon} ${iconClass}`}>
        {status === "done" ? (
          <CheckIcon />
        ) : status === "active" ? (
          <ActiveCircleIcon />
        ) : (
          <EmptyCircleIcon />
        )}
      </div>
      <span className={`${styles.label} ${labelClass}`}>
        {label}
        <span className={styles.srOnly}>{srStatus}</span>
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
      className={`${styles.connector} ${filled ? styles.connectorFilled : styles.connectorEmpty}`}
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
    <nav className={styles.rail} aria-label="Progress">
      <Step label="Registered" status={registeredStatus} />
      <Connector filled={state.registered} />
      <Step label="Verified" status={verifiedStatus} />
      <Connector filled={state.verified} />
      <Step label="Paid" status={paidStatus} />
    </nav>
  );
}

export default MilestoneRail;
