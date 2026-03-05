import { test, expect } from "@playwright/test";

test.describe("WorkFlow Breaker — Main Flow", () => {
  test("homepage loads with all key elements", async ({ page }) => {
    await page.goto("/");
    // Title
    await expect(page.locator("h1")).toContainText("WorkFlow Breaker");
    // Hero
    await expect(page.locator("h2").first()).toBeVisible();
    // Goal input
    await expect(page.locator("input[placeholder]")).toBeVisible();
    // Strategy buttons (5 total)
    const stratButtons = page.locator("button:has-text('WBS'), button:has-text('User Story'), button:has-text('SIPOC'), button:has-text('5W1H')");
    await expect(stratButtons.first()).toBeVisible();
    // Generate button
    await expect(page.locator("button:has-text('AI')")).toBeVisible();
    // Examples
    await expect(page.locator("text=SaaS")).toBeVisible();
    // Weekly challenge
    await expect(page.locator("text=挑戰").first()).toBeVisible();
  });

  test("language toggle switches to English", async ({ page }) => {
    await page.goto("/");
    await page.click("button:has-text('EN')");
    await expect(page.locator("h2").first()).toContainText("Multi-dimensional");
    await expect(page.locator("button:has-text('中文')")).toBeVisible();
  });

  test("clicking example fills input", async ({ page }) => {
    await page.goto("/");
    await page.click("button:has-text('SaaS')");
    const input = page.locator("input[placeholder]");
    await expect(input).not.toHaveValue("");
  });

  test("tutorial tab shows methods wiki", async ({ page }) => {
    await page.goto("/");
    await page.click("button:has-text('方法百科')");
    await expect(page.locator("text=工作流拆解方法全集")).toBeVisible();
  });

  test("dark mode toggle works", async ({ page }) => {
    await page.goto("/");
    // Click moon icon (dark mode toggle)
    await page.click("button[title]");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("隱私");
  });

  test("weekly challenge sets goal and strategy", async ({ page }) => {
    await page.goto("/");
    await page.click("button:has-text('接受挑戰')");
    const input = page.locator("input[placeholder]");
    await expect(input).not.toHaveValue("");
  });
});
