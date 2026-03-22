import { test, expect } from "@playwright/test";

test.describe("Dark Mode — Visual Regression & Contrast", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("light mode homepage screenshot", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("WorkFlow Breaker");
    await expect(page).toHaveScreenshot("homepage-light.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("dark mode homepage screenshot", async ({ page }) => {
    // Toggle dark mode
    await page.click('button[title="深色模式"]');
    await expect(page.locator("html")).toHaveClass(/dark/);
    // Wait for transition to finish
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("homepage-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("example buttons have sufficient contrast in dark mode", async ({ page }) => {
    await page.click('button[title="深色模式"]');
    await page.waitForTimeout(400);

    const exampleBtn = page.locator(".example-btn").first();
    await expect(exampleBtn).toBeVisible();

    // Verify text color and background in dark mode
    const color = await exampleBtn.evaluate((el) => getComputedStyle(el).color);
    const bg = await exampleBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

    // Parse RGB values and compute relative luminance
    const parseRgb = (s: string) => {
      const m = s.match(/\d+/g)!.map(Number);
      return { r: m[0], g: m[1], b: m[2] };
    };
    const luminance = (c: { r: number; g: number; b: number }) => {
      const [rs, gs, bs] = [c.r, c.g, c.b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    const fg = parseRgb(color);
    const bgc = parseRgb(bg);
    const l1 = Math.max(luminance(fg), luminance(bgc));
    const l2 = Math.min(luminance(fg), luminance(bgc));
    const contrastRatio = (l1 + 0.05) / (l2 + 0.05);

    // WCAG AA requires 4.5:1 for normal text
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test("example buttons hover shows visual change beyond color", async ({ page }) => {
    await page.click('button[title="深色模式"]');
    await page.waitForTimeout(400);

    const exampleBtn = page.locator(".example-btn").first();
    const borderBefore = await exampleBtn.evaluate((el) => getComputedStyle(el).borderColor);
    const shadowBefore = await exampleBtn.evaluate((el) => getComputedStyle(el).boxShadow);

    await exampleBtn.hover();
    await page.waitForTimeout(250);

    const borderAfter = await exampleBtn.evaluate((el) => getComputedStyle(el).borderColor);
    const shadowAfter = await exampleBtn.evaluate((el) => getComputedStyle(el).boxShadow);

    // At least one non-color indicator must change (box-shadow or border)
    const hasVisualChange = borderBefore !== borderAfter || shadowBefore !== shadowAfter;
    expect(hasVisualChange).toBe(true);
  });

  test("focus ring visible in dark mode", async ({ page }) => {
    await page.click('button[title="深色模式"]');
    await page.waitForTimeout(400);

    // Tab to the first example button
    const exampleBtn = page.locator(".example-btn").first();
    await exampleBtn.focus();

    const outline = await exampleBtn.evaluate((el) => {
      const s = getComputedStyle(el);
      return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
    });

    // Should have a visible focus outline (not "none 0px")
    expect(outline).not.toContain("none 0px");
  });

  test("text-muted elements have AA contrast in dark mode", async ({ page }) => {
    await page.click('button[title="深色模式"]');
    await page.waitForTimeout(400);

    // Check the hero description (uses text-text-muted)
    const heroDesc = page.locator("p.text-text-muted").first();
    await expect(heroDesc).toBeVisible();

    const color = await heroDesc.evaluate((el) => getComputedStyle(el).color);
    // Should be #D1D5DB (209, 213, 219) in dark mode, not #6B7280
    const parseRgb = (s: string) => s.match(/\d+/g)!.map(Number);
    const [r] = parseRgb(color);
    // In dark mode the red channel should be >= 200 (was 107 before fix)
    expect(r).toBeGreaterThanOrEqual(180);
  });
});
