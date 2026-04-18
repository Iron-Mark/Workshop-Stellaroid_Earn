import { defineConfig, devices } from "@playwright/test";

const PORT = 3007;
const baseURL = `http://127.0.0.1:${PORT}`;
const E2E_READ_ADDRESS =
  "GAWIOVGF3N7G3K4J4Y6MGSQYPN4K53Q3VHWL5V66B5Y4BBJH3M6AJYLD";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_E2E_MODE: "1",
      NEXT_PUBLIC_SOROBAN_CONTRACT_ID:
        "CD7J5J6EJ6G6PU4ORLQR5XULX2R6S44B4WRQXWQL4MNP2J7YJ3UQTEST",
      NEXT_PUBLIC_STELLAR_READ_ADDRESS: E2E_READ_ADDRESS,
      NEXT_PUBLIC_STELLAR_NETWORK: "TESTNET",
      NEXT_PUBLIC_STELLAR_RPC_URL: "https://soroban-testnet.stellar.org",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
