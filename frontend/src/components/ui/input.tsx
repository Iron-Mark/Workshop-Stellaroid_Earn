// frontend/src/components/ui/input.tsx
"use client";

import * as React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Boolean error state OR error message string */
  error?: boolean | string;
  label?: string;
  helper?: string;
  mono?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helper, mono, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex w-full min-h-[44px] px-3 py-2",
            "rounded-lg bg-surface-2 border",
            mono ? "font-mono" : "font-sans",
            "text-[15px] text-text placeholder:text-text-muted/60",
            "transition-colors duration-150",
            hasError
              ? "border-danger focus-visible:outline-danger"
              : "border-border focus-visible:border-primary focus-visible:outline-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:opacity-45 disabled:cursor-not-allowed",
            className
          )}
          aria-describedby={
            errorMessage ? errorId : helper ? helperId : undefined
          }
          aria-invalid={hasError ? "true" : undefined}
          {...props}
        />
        {errorMessage ? (
          <p id={errorId} className="text-[12px] text-danger" role="alert">
            {errorMessage}
          </p>
        ) : helper ? (
          <p id={helperId} className="text-[12px] text-text-muted">
            {helper}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export default Input;
