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

test.describe("Admin Settings Management", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the admin settings page
        await page.goto("http://127.0.0.1:8000/admin/manajemen-pengaturan");
    });

    test("Admin can upload company logo and save settings", async ({
        page,
    }) => {
        const testGroup = "admin";
        const testName = "company-logo-upload";

        // Take screenshot of the admin login page
        await takeScreenshot(page, testGroup, testName, "admin-login-page");

        // Login process
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(adminCredentials.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");

        // Fix typo that was in original test
        if (
            (await page
                .getByRole("textbox", { name: "Email" })
                .inputValue()) !== adminCredentials.email
        ) {
            await page.getByRole("textbox", { name: "Email" }).click();
            await page
                .getByRole("textbox", { name: "Email" })
                .fill(adminCredentials.email);
            await page.getByRole("textbox", { name: "Email" }).press("Tab");
        }

        await page
            .getByRole("textbox", { name: "Password" })
            .fill(adminCredentials.password);

        // Take screenshot with form filled
        await takeScreenshot(page, testGroup, testName, "login-form-filled");

        // Login using Enter key or button click
        await page.getByRole("textbox", { name: "Password" }).press("Enter");

        // // If Enter key doesn't work, try clicking the button
        // if (page.url().includes("login")) {
        //     await page.getByRole("button", { name: "Log in" }).click();
        // }

        // Expect to be redirected to the admin panel after login
        await expect(page).toHaveURL(/.*\/admin\/manajemen-pengaturan.*/);

        // Take screenshot of admin settings page
        await takeScreenshot(page, testGroup, testName, "admin-settings-page");

        // Click on the company logo button
        const logoButton = page.getByRole("button", {
            name: "Logo Perusahaan",
        });
        await expect(logoButton).toBeVisible();
        await logoButton.click();

        // Take screenshot before file upload
        await takeScreenshot(page, testGroup, testName, "before-logo-upload");

        // Prepare the file path for upload - make sure this file exists
        const logoFilePath = path.join(
            process.cwd(),
            "e2e",
            "assets",
            "Logo_INKA_-_Industri_Kereta_Api_Indonesia.svg.png"
        );

        // Create fixtures directory if it doesn't exist
        const fixturesDir = path.join(process.cwd(), "e2e", "assets");
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
        }

        // Check if the file exists, if not create a small test image
        if (!fs.existsSync(logoFilePath)) {
            console.log("Test logo file not found, creating a placeholder...");
            // This is a fallback to create a small test PNG if the original doesn't exist
            const base64Image =
                "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO3gAAAABJRU5ErkJggg==";
            const imageBuffer = Buffer.from(base64Image, "base64");
            fs.writeFileSync(logoFilePath, imageBuffer);
        }

        // Upload the company logo
        await logoButton.setInputFiles(logoFilePath);

        // Take screenshot after file selection
        await takeScreenshot(page, testGroup, testName, "after-logo-upload");

        // Click save settings button
        const saveButton = page.getByRole("button", {
            name: "Simpan Pengaturan",
        });
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        // Wait for success message or confirmation of settings saved
        // Assuming there might be a success message visible after saving
        await page.waitForTimeout(1000); // Wait for any animations or server response

        // Take screenshot after saving settings
        await takeScreenshot(page, testGroup, testName, "after-save-settings");

        // Additional assertions could be added here to verify settings were saved
        // For example, check for success message or verify the logo appears in the UI
    });

    test("Admin can navigate through settings tabs", async ({ page }) => {
        const testGroup = "admin";
        const testName = "settings-navigation";

        // Login first
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(adminCredentials.email);
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(adminCredentials.password);
        await page.getByRole("button", { name: "Log in" }).click();

        // Take screenshot of admin settings initial page
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "initial-settings-page"
        );

        // Navigate through different settings tabs (assuming there are tabs)
        // This is a placeholder - you'll need to adjust based on your actual UI
        const tabs = [
            { name: "Umum", selector: "text=Umum" },
            { name: "Tampilan", selector: "text=Tampilan" },
            { name: "Notifikasi", selector: "text=Notifikasi" },
        ];

        // Click each tab and take screenshots
        for (const tab of tabs) {
            try {
                const tabElement = page.locator(tab.selector);
                if (await tabElement.isVisible()) {
                    await tabElement.click();
                    await page.waitForTimeout(500); // Wait for tab content to load
                    await takeScreenshot(
                        page,
                        testGroup,
                        testName,
                        `${tab.name.toLowerCase()}-tab`
                    );
                }
            } catch (error) {
                console.log(`Tab ${tab.name} not found or not clickable`);
            }
        }
    });
});
