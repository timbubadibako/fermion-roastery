import { expect, test } from "@playwright/test";
import { testAccounts } from "./fixtures.js";

const hasRetail = Boolean(testAccounts.retail.email && testAccounts.retail.password);
const hasAdmin = Boolean(testAccounts.admin.email && testAccounts.admin.password);

async function login(page, email, password) {
  await page.goto("/auth");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button").first().click();
}

test.describe("authenticated flows", () => {
  test.skip(!hasRetail, "Retail E2E credentials are not configured");
  test("retail user can open account area", async ({ page }) => {
    await login(page, testAccounts.retail.email, testAccounts.retail.password);
    await expect(page).toHaveURL(/account|b2b|admin/);
  });

  test.skip(!hasAdmin, "Admin E2E credentials are not configured");
  test("admin can open orders board", async ({ page }) => {
    await login(page, testAccounts.admin.email, testAccounts.admin.password);
    await page.goto("/admin/orders");
    await expect(page.getByText(/Manajemen/i)).toBeVisible();
  });
});
