// frontend/src/components/ui/skeleton.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Explicit width (number = px, string = any CSS value) */
  width?: number | string;
  /** Explicit height (number = px, string = any CSS value) */
  height?: number | string;
  /** Border-radius override (number = px, string = any CSS value) */
  radius?: number | string;
}

function toPx(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function Skeleton({ className, width, height, radius, style, ...props }: SkeletonProps) {
  const inlineStyle: React.CSSProperties = {
    ...(width !== undefined ? { width: toPx(width) } : {}),
    ...(height !== undefined ? { height: toPx(height) } : {}),
    ...(radius !== undefined ? { borderRadius: toPx(radius) } : {}),
    ...style,
  };

  return (
    <span
      className={cn(
        "block rounded-md",
        "bg-[length:200%_100%] bg-linear-to-r",
        "from-surface-2 via-surface to-surface-2",
        "[animation:shimmer_1.8s_linear_infinite]",
        className
      )}
      style={inlineStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;
