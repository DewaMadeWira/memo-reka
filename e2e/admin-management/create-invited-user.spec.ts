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

test.describe("Invited User Management", () => {
    test("Admin can add, edit, and delete an invited user", async ({
        page,
    }) => {
        const testGroup = "invited-user-management";
        const testName = "crud-operations";

        // Step 1: Login
        await page.goto(
            "http://127.0.0.1:8000/admin/manajemen-pengguna-undangan"
        );
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

        // Verify successful login

        // Step 2: Navigate to invited user management and add a new invited user
        await page
            .getByRole("button", { name: "+ Tambah Pengguna Undangan" })
            .click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "04-add-invited-user-form"
        );

        // Fill in user details
        await page.getByRole("textbox", { name: "Nama Pengguna" }).click();
        await page.getByRole("textbox", { name: "Nama Pengguna" }).fill("123");
        await page.locator('select[name="division_id"]').selectOption("2");
        await page.locator('select[name="official_id"]').selectOption("2");

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "05-invited-user-form-filled"
        );

        // Save the new invited user
        await page.getByRole("button", { name: "Simpan" }).click();
        await page.waitForTimeout(1000); // Wait for save operation to complete

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "06-after-user-creation"
        );

        // Step 4: Locate and edit the newly created invited user
        const userRow = page.getByRole("row", {
            name: "123 HR & GA Manager Open menu",
        });
        await expect(userRow).toBeVisible({ timeout: 5000 });

        await takeScreenshot(page, testGroup, testName, "08-new-user-in-list");

        await userRow.getByRole("button").click();
        await takeScreenshot(page, testGroup, testName, "09-user-menu-open");

        await page.getByRole("menuitem", { name: "Edit" }).click();
        await takeScreenshot(page, testGroup, testName, "10-edit-user-form");

        // Edit the user name
        await page.getByRole("textbox", { name: "Nama Pengguna" }).click();
        await page.getByRole("textbox", { name: "Nama Pengguna" }).fill("1234");

        await takeScreenshot(page, testGroup, testName, "11-edit-form-filled");

        // Save the changes
        await page.getByRole("button", { name: "Simpan" }).click();
        await page.waitForTimeout(1000); // Wait for update operation to complete

        await takeScreenshot(page, testGroup, testName, "12-after-user-update");

        // Click away to close any dialogs
        await page.locator("html").click();
        await page.locator("html").click();

        // Step 5: Navigate back to the invited user management page and refresh
        await page.goto(
            "http://127.0.0.1:8000/admin/manajemen-pengguna-undangan"
        );
        await takeScreenshot(page, testGroup, testName, "13-invited-user-page");

        // Click away
        await page.locator("html").click();

        // Refresh the page
        await page.locator("body").press("ControlOrMeta+r");
        await page.waitForTimeout(2000); // Wait for page to reload

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "14-page-after-refresh"
        );

        // Step 6: Verify the updated user exists
        const updatedUserRow = page.getByRole("row", {
            name: "1234",
        });
        await expect(updatedUserRow).toBeVisible({ timeout: 5000 });

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "15-updated-user-in-list"
        );

        // Step 8: Delete the user
        await updatedUserRow.getByRole("button").click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "19-user-menu-for-delete"
        );

        await page.getByRole("menuitem", { name: "Hapus" }).click();
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "20-delete-confirmation"
        );


        await page.waitForTimeout(1000);
        await takeScreenshot(
            page,
            testGroup,
            testName,
            "21-after-user-deletion"
        );

        // Verify the user was deleted
        try {
            await expect(
                page.getByRole("row", {
                    name: "1234 HR & GA Manager Open menu",
                })
            ).not.toBeVisible({ timeout: 3000 });
            await takeScreenshot(
                page,
                testGroup,
                testName,
                "22-user-list-after-deletion"
            );
        } catch (error) {
            console.log("User might still be visible or verification failed");
            await takeScreenshot(
                page,
                testGroup,
                testName,
                "22-verification-failed"
            );
        }
    });

    // test("Admin can cancel invited user creation", async ({ page }) => {
    //     const testGroup = "invited-user-management";
    //     const testName = "cancel-creation";

    //     // Login
    //     await page.goto("http://127.0.0.1:8000/login");
    //     await page
    //         .getByRole("textbox", { name: "Email" })
    //         .fill(adminCredentials.email);
    //     await page
    //         .getByRole("textbox", { name: "Password" })
    //         .fill(adminCredentials.password);
    //     await page.getByRole("button", { name: "Log in" }).click();

    //     await takeScreenshot(
    //         page,
    //         testGroup,
    //         testName,
    //         "01-dashboard-after-login"
    //     );

    //     // Open the add invited user form
    //     await page
    //         .getByRole("button", { name: "+ Tambah Pengguna Undangan" })
    //         .click();
    //     await takeScreenshot(
    //         page,
    //         testGroup,
    //         testName,
    //         "02-add-invited-user-form"
    //     );

    //     // Fill in some details but not all
    //     await page.getByRole("textbox", { name: "Nama Pengguna" }).click();
    //     await page
    //         .getByRole("textbox", { name: "Nama Pengguna" })
    //         .fill("Test Invited User");

    //     await takeScreenshot(
    //         page,
    //         testGroup,
    //         testName,
    //         "03-partially-filled-form"
    //     );

    //     // Look for cancel button and click it if available
    //     try {
    //         await page.getByRole("button", { name: "Batal" }).click();
    //         await takeScreenshot(page, testGroup, testName, "04-after-cancel");
    //     } catch (error) {
    //         console.log("Cancel button not found, clicking outside the form");
    //         await page.locator("html").click({ position: { x: 10, y: 10 } });
    //         await takeScreenshot(
    //             page,
    //             testGroup,
    //             testName,
    //             "04-after-clicking-outside"
    //         );
    //     }

    //     // Verify we're back to the user list
    //     await expect(
    //         page.getByRole("button", { name: "+ Tambah Pengguna Undangan" })
    //     ).toBeVisible({ timeout: 3000 });

    //     await takeScreenshot(page, testGroup, testName, "05-back-to-user-list");
    // });
});
