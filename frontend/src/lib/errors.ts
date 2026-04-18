export type HumanError = { title: string; detail: string; recoverable: boolean };

export function humanizeError(err: unknown): HumanError {
  try {
    const message =
      err instanceof Error
        ? err.message.toLowerCase()
        : typeof err === "string"
          ? err.toLowerCase()
          : "";
    const name =
      err instanceof Error ? err.name.toLowerCase() : "";

    // User rejected / declined / denied
    if (
      message.includes("user rejected") ||
      message.includes("declined") ||
      message.includes("denied")
    ) {
      return {
        title: "Signing declined",
        detail: "You cancelled the request in Freighter. Try again when ready.",
        recoverable: true,
      };
    }

    // Network mismatch / wrong network
    if (message.includes("network mismatch") || message.includes("wrong network")) {
      return {
        title: "Wrong network",
        detail: "Switch Freighter to the Stellar testnet and try again.",
        recoverable: true,
      };
    }

    // Timeout (from withTimeout)
    if (message.startsWith("timeout:")) {
      return {
        title: "Still settling\u2026",
        detail:
          "Testnet is slow right now \u2014 your transaction may still confirm. Check the explorer.",
        recoverable: true,
      };
    }

    // Simulation failed
    if (message.includes("simulation failed") || message.includes("simulate")) {
      return {
        title: "Transaction simulation failed",
        detail:
          "The contract rejected this input. Double-check addresses and hash format.",
        recoverable: true,
      };
    }

    // Unauthorized / auth / #1
    if (
      message.includes("unauthorized") ||
      message.includes(" auth") ||
      message.includes("#1") ||
      name.includes("unauthorized")
    ) {
      return {
        title: "Not authorized",
        detail: "This action requires a different signer.",
        recoverable: false,
      };
    }

    // Not found / #2
    if (
      message.includes("not found") ||
      message.includes("#2")
    ) {
      return {
        title: "Not found",
        detail: "No record for that certificate hash yet.",
        recoverable: true,
      };
    }

    // Already exists / duplicate / #3
    if (
      message.includes("already exists") ||
      message.includes("duplicate") ||
      message.includes("#3")
    ) {
      return {
        title: "Already registered",
        detail: "This certificate hash is already on-chain.",
        recoverable: false,
      };
    }

    // Invalid input / invalid / #4
    if (
      message.includes("invalid input") ||
      message.includes("invalid") ||
      message.includes("#4")
    ) {
      return {
        title: "Invalid input",
        detail:
          "Check the student wallet address and that the hash is 64 hex characters.",
        recoverable: true,
      };
    }

    // Fetch failed / network error / ECONNREFUSED
    if (
      message.includes("fetch failed") ||
      message.includes("network error") ||
      message.includes("econnrefused")
    ) {
      return {
        title: "Connection problem",
        detail: "Could not reach the Stellar RPC. Check your internet.",
        recoverable: true,
      };
    }

    // Insufficient balance
    if (message.includes("insufficient") || message.includes("balance")) {
      return {
        title: "Insufficient balance",
        detail: "Fund your testnet wallet with Friendbot and try again.",
        recoverable: true,
      };
    }

    // Fallback
    return {
      title: "Transaction failed",
      detail:
        "Please try again. If this keeps happening, check the explorer.",
      recoverable: true,
    };
  } catch {
    return {
      title: "Transaction failed",
      detail: "Please try again. If this keeps happening, check the explorer.",
      recoverable: true,
    };
  }
}
