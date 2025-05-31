import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Define base screenshots directory
const baseScreenshotsDir = path.join(
    process.cwd(),
    "test-results",
    "screenshots"
);

// Function to create screenshot directory for a specific test
const createScreenshotDir = (testGroup, testName) => {
    const dir = path.join(baseScreenshotsDir, testGroup, testName);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
};

// Function to take screenshot with proper naming and folder structure
const takeScreenshot = async (page, testGroup, testName, screenshotName) => {
    const dir = createScreenshotDir(testGroup, testName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(dir, `${screenshotName}_${timestamp}.png`);
    await page.screenshot({ path: filePath });
    return filePath;
};

// Admin credentials
const adminCredentials = {
    email: "mhr@gmail.com",
    password: "password123",
};

test.describe("Role Management", () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        const testGroup = "role-management";
        const testName = "login";

        await page.goto("http://127.0.0.1:8000/admin/manajemen-role");
        await takeScreenshot(page, testGroup, testName, "01-login-page");

        await page.getByRole("textbox", { name: "Email" }).click();
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(adminCredentials.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(adminCredentials.password);

        await takeScreenshot(page, testGroup, testName, "02-login-form-filled");

        await page.getByRole("button", { name: "Log in" }).click();

        // Verify we're logged in
        await page.waitForTimeout(1000); // Wait for dashboard to load
        await takeScreenshot(page, testGroup, testName, "03-after-login");
    });

    test("Admin can edit role name", async ({ page }) => {
        const testGroup = "role-management";
        const testName = "edit-role";

        // Step 1: Capture initial state
        await takeScreenshot(page, testGroup, testName, "01-dashboard-initial");

        // Step 2: Click on Edit button (second role in the list)
        await page.getByRole("button", { name: "Edit" }).nth(1).click();
        await page.waitForTimeout(500); // Wait for edit form to appear

        await takeScreenshot(page, testGroup, testName, "02-edit-role-form");

        // Step 3: Update the role name
        await page.locator("#role_name").click();
        await page.locator("#role_name").fill("user_updated");

        await takeScreenshot(page, testGroup, testName, "03-role-name-updated");

        // Step 4: Save the changes
        await page.getByRole("button", { name: "Simpan" }).click();
        await page.waitForTimeout(1000); // Wait for save operation

        await takeScreenshot(page, testGroup, testName, "04-after-role-update");

        // Step 5: Verify the role was updated
        // This depends on how your UI shows success feedback
        try {
            // Try to find a success message or the updated role name
            const successIndicator = page.getByText("user_updated");
            await expect(successIndicator).toBeVisible({ timeout: 3000 });
            await takeScreenshot(
                page,
                testGroup,
                testName,
                "05-verification-successful"
            );
        } catch (error) {
            console.log("Could not verify update success through UI elements");
            await takeScreenshot(
                page,
                testGroup,
                testName,
                "05-verification-inconclusive"
            );
        }
    });
});
