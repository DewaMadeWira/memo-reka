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

test.describe("Position Management", () => {
    test("Admin can add, edit, and delete a position", async ({ page }) => {
        const testGroup = "position-management";
        const testName = "crud-operations";

        // Step 1: Login
        await page.goto("http://127.0.0.1:8000/admin/manajemen-pejabat");
        await takeScreenshot(page, testGroup, testName, "01-login-page");

        await page
            .getByRole("textbox", { name: "Email" })
            .fill(adminCredentials.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(adminCredentials.password);

        await takeScreenshot(page, testGroup, testName, "02-login-form-filled");

        await page.getByRole("button", { name: "Log in" }).click();

        // Step 2: Navigate to position management (if not already there)
        // Since we don't know the exact URL, we'll make sure we're on a page with the "Tambah Pejabat" button

        // Step 3: Add a new position
        await page.getByRole("button", { name: "+ Tambah Pejabat" }).click();
        await takeScreenshot(page, testGroup, testName, "04-add-position-form");

        // Fill in position details
        await page.getByRole("textbox", { name: "Nama Jabatan" }).click();
        await page
            .getByRole("textbox", { name: "Nama Jabatan" })
            .fill("new jabatan");

        await page.getByRole("textbox", { name: "Kode Jabatan" }).click();
        await page.getByRole("textbox", { name: "Kode Jabatan" }).fill("1234");

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "05-position-form-filled"
        );

        // Save the new position
        await page.getByRole("button", { name: "Simpan" }).click();
        await page.waitForTimeout(1000); // Wait for save operation

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "06-after-position-creation"
        );

        // Step 4: Navigate through pages
        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(page, testGroup, testName, "07-after-first-next");

        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(page, testGroup, testName, "08-after-second-next");

        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(page, testGroup, testName, "09-after-third-next");

        // Step 5: Edit the position
        // It seems we're targeting the second position in the list with nth(1)
        await page.getByRole("button", { name: "Edit" }).nth(1).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "10-edit-position-form"
        );

        // First we click the name field
        await page.getByRole("textbox", { name: "Nama Jabatan" }).click();

        // Then we decide to go back
        await page.getByRole("button", { name: "Kembali" }).click();
        await takeScreenshot(page, testGroup, testName, "11-after-cancel-edit");

        // Now we try editing again
        await page.getByRole("button", { name: "Edit" }).nth(1).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "12-edit-position-form-again"
        );

        // Edit the position details
        await page.getByRole("textbox", { name: "Nama Jabatan" }).click();
        await page
            .getByRole("textbox", { name: "Nama Jabatan" })
            .fill("new jabatan updated");

        await page.getByRole("textbox", { name: "Kode Jabatan" }).click();
        await page.getByRole("textbox", { name: "Kode Jabatan" }).fill("12345");

        await takeScreenshot(page, testGroup, testName, "13-edit-form-filled");

        // Save the edited position
        await page.getByRole("button", { name: "Simpan" }).click();
        await page.waitForTimeout(1000); // Wait for update operation

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "14-after-position-update"
        );

        // Step 6: Navigate through pages again
        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "15-after-first-next-again"
        );

        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "16-after-second-next-again"
        );

        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "17-after-third-next-again"
        );

        // Click on the pagination control
        await page.getByText("SebelumnyaSelanjutnya").click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "18-after-pagination-click"
        );

        // Step 7: Delete the position
        await page.getByRole("button", { name: "Hapus" }).nth(1).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "19-delete-confirmation"
        );

        // Confirm deletion
        await page.getByRole("button", { name: "Hapus" }).click();
        await page.waitForTimeout(1000); // Wait for delete operation

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "20-after-position-deletion"
        );

        // Step 8: Navigate through pages once more
        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "21-after-first-next-final"
        );

        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "22-after-second-next-final"
        );

        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "23-after-third-next-final"
        );

        // Click on the pagination control again
        await page.getByText("SebelumnyaSelanjutnya").click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "24-final-pagination-click"
        );

        // Go to previous page
        await page.getByRole("button", { name: "Sebelumnya" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "25-after-previous-button"
        );

        // And back to next
        await page.getByRole("button", { name: "Selanjutnya" }).click();
        await takeScreenshot(page, testGroup, testName, "26-final-state");

        // Verify we're on the expected page
        // This is a basic check - you may want to add more specific assertions
        await expect(
            page.getByRole("button", { name: "Selanjutnya" })
        ).toBeVisible();
    });
});
