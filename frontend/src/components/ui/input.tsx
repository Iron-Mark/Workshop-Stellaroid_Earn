"use client";

import { InputHTMLAttributes, useId } from "react";
import styles from "./input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  mono?: boolean;
}

export function Input({
  label,
  helper,
  error,
  mono = false,
  id: idProp,
  className,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const inputClass = [
    styles.input,
    mono ? styles.mono : undefined,
    error ? styles.inputError : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        {...rest}
        id={id}
        className={inputClass}
        aria-describedby={
          error ? errorId : helper ? helperId : undefined
        }
        aria-invalid={error ? "true" : undefined}
      />
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className={styles.helper}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
