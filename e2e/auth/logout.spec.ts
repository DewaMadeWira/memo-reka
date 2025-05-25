import { test, expect } from "@playwright/test";

test("should log out successfully", async ({ page }) => {
    // First log in to the system
    await page.goto("http://127.0.0.1:8000/login");
    await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    // Verify we are logged in successfully (check for presence of profile button)
    await expect(
        page.getByRole("button", { name: "Manager HR" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Manager HR" }).click();

    // Perform logout action
    await page.getByRole("button", { name: "Logout" }).click();

    // Verify we are logged out and redirected to login page
    await expect(page).toHaveURL("http://127.0.0.1:8000/");

    // await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});
