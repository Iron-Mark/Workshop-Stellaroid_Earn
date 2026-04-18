import { expect, test } from "@playwright/test";

test("register, verify, pay, and open the proof page", async ({ page }) => {
  await page.goto("/app");

  await expect(
    page.getByRole("button", { name: "Connect Freighter" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Connect Freighter" }).click();

  await expect(page.getByText("GAWIO…AJYLD")).toBeVisible();

  await page.getByRole("button", { name: "Autofill demo inputs" }).click();

  const studentWalletInput = page.getByLabel("Student wallet (G...)").first();
  const hashInput = page.getByLabel("Certificate hash (64 hex)");
  const studentWallet = (await studentWalletInput.inputValue()).trim();
  const certHash = (await hashInput.inputValue()).trim();

  await page.getByRole("button", { name: "Register Certificate" }).click();
  await expect(page.getByText("Certificate registered")).toBeVisible();

  await page.getByRole("radio", { name: /Employer/i }).click();
  await expect(
    page.getByRole("button", { name: "Mark Verified (on-chain)" }),
  ).toBeEnabled();

  await page.getByRole("button", { name: "Mark Verified (on-chain)" }).click();
  await expect(page.getByText("Certificate verified")).toBeVisible();
  await expect(page.getByText("Verified")).toBeVisible();

  await expect(page.getByRole("button", { name: "Pay Student" })).toBeEnabled();
  await page.getByRole("button", { name: "Pay Student" }).click();
  await expect(page.getByText("Payment settled")).toBeVisible();

  const proofLink = page.getByRole("link", { name: "Open public Proof Block" });
  await expect(proofLink).toHaveAttribute("href", `/proof/${certHash}`);
  await proofLink.click();

  await expect(page).toHaveURL(`/proof/${certHash}`);
  await expect(page.getByRole("heading", { name: /On-chain credential/i })).toBeVisible();
  await expect(page.getByText("Yes")).toBeVisible();
  await expect(page.getByText(studentWallet.slice(0, 5))).toBeVisible();
});
