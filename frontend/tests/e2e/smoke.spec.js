import { expect, test } from "@playwright/test";
import { seededProducts } from "./fixtures.js";

test("homepage renders key public sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Fermion/i).first()).toBeVisible();
  await expect(page.getByText(/Jurnal Roastery|Roastery Journal/i)).toBeVisible();
});

test("retail catalog search query is routable", async ({ page }) => {
  await page.goto(`/our-coffee?search=${seededProducts.retailSearchTerm}`);
  await expect(page).toHaveURL(/our-coffee/);
});
