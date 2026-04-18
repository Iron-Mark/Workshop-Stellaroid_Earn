import { HTMLAttributes, ReactNode } from "react";
import styles from "./badge.module.css";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "accent";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
  children?: ReactNode;
}

export function Badge({
  tone = "neutral",
  dot = false,
  children,
  className,
  ...rest
}: BadgeProps) {
  const classes = [styles.badge, styles[tone], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...rest} className={classes}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;
