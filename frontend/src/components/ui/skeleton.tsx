import { CSSProperties } from "react";
import styles from "./skeleton.module.css";

export interface SkeletonProps {
  width: number | string;
  height: number | string;
  radius?: number | string;
  className?: string;
}

function toPx(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function Skeleton({ width, height, radius, className }: SkeletonProps) {
  const style: CSSProperties = {
    width: toPx(width),
    height: toPx(height),
    borderRadius: radius !== undefined ? toPx(radius) : "var(--radius-sm)",
  };

  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={style}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
