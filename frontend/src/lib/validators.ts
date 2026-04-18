import { Address } from "@stellar/stellar-sdk";

export function isValidStellarAddress(value: string): boolean {
  try {
    Address.fromString(value.trim());
    return true;
  } catch {
    return false;
  }
}

export function requireText(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} is required.`);
  return normalized;
}

export function parsePositiveInteger(value: string, label: string): number {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized))
    throw new Error(`${label} must be a positive whole number.`);
  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed <= 0)
    throw new Error(`${label} must be a positive whole number.`);
  return parsed;
}
