// @ts-check
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("http://207.154.224.208/login.php");
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill("admin");
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "DVWA Security" }).click();
  await page.getByRole("button", { name: "Submit" }).click();
});

test.describe("DVWA", () => {
  test("XSS Low", async ({ page }) => {
    // Test for XSS Reflected

    page.on("dialog", async (alert) => {
      const text = alert.message();
      expect(text).toContain("XSS");
      console.log(text);
      await alert.accept();
    });

    await page.getByRole("link", { name: "XSS (Reflected)" }).click();
    await page.getByRole("textbox").click();
    await page.getByRole("textbox").fill("dave");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Hello dave").click();
    expect(page.getByText("Hello")).toContainText("dave");
    await page.getByRole("textbox").fill("<script>alert('XSS')</script>");
    await page.getByRole("button", { name: "Submit" }).click();
  });
  test("XSS Medium", async ({ page }) => {
    // Test for XSS Reflected

    // page.on("dialog", async (alert) => {
    //   const text = alert.message();
    //   expect(text).not.toContain("XSS");
    //   console.log(text);
    //   await alert.accept();
    // });

    await page.getByRole("link", { name: "XSS (Reflected)" }).click();
    await page.getByRole("textbox").click();
    await page.getByRole("textbox").fill("dave");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Hello dave").click();
    expect(page.getByText("Hello")).toContainText("dave");
    await page.getByRole("link", { name: "DVWA Security" }).click();
    await page.getByRole("combobox").selectOption("medium");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByRole("link", { name: "XSS (Reflected)" }).click();
    await page.getByRole("textbox").fill("<script>alert('XSS')</script>");
    await page.getByRole("button", { name: "Submit" }).click();
    expect(page.getByText("Hello")).toContainText("alert");
  });
});
