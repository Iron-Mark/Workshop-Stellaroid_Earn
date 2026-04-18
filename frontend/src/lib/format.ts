export function parseAmountToInt(amount: string, decimals: number): bigint {
  const [wholePart, fractionPart = ""] = amount.trim().split(".");
  if (fractionPart.length > decimals) {
    throw new Error(`Use at most ${decimals} decimal places for this asset.`);
  }
  const whole = BigInt(wholePart || "0");
  const paddedFraction = fractionPart.padEnd(decimals, "0");
  const fraction = paddedFraction ? BigInt(paddedFraction) : 0n;
  const result = whole * 10n ** BigInt(decimals) + fraction;
  if (result <= 0n) throw new Error("Amount must be greater than zero.");
  return result;
}

export function formatAmount(value: bigint, decimals: number): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = value % base;
  if (fraction === 0n) return whole.toString();
  const trimmed = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${whole}.${trimmed}`;
}

export function shortenAddress(address: string | null, size = 6): string {
  if (!address) return "Not connected";
  return `${address.slice(0, size)}...${address.slice(-size)}`;
}
