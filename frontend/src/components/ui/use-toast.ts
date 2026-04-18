"use client";

import { useContext } from "react";
import { ToastContext } from "./toast";

export type ToastTone = "success" | "danger" | "warning" | "neutral";

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastInput {
  title: string;
  detail?: string;
  tone?: ToastTone;
  action?: ToastAction;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
