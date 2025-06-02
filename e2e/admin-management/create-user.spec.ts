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

// Admin credentials - using the same credentials from your existing test
const adminEmail = "mhr@gmail.com";
const adminPassword = "password123";

// Test data for different user roles
const testUsers = [
    {
        name: "Manager Test User",
        email: "manager_test@example.com",
        password: "password123",
        role_id: "1", // Manager role
        division_id: "2",
        role_name: "Manager HR",
    },
    {
        name: "Employee Test User",
        email: "employee_test@example.com",
        password: "password123",
        role_id: "2", // Employee role
        division_id: "2",
        role_name: "Pegawai LOG",
    },
];

test.describe("User Management Tests", () => {
    // Migrate fresh to avoid error
    // Due to soft delete that didn't allow duplicate username
    test.beforeEach(async ({ page }) => {
        const testGroup = "admin-management";
        const testName = "login";

        // Login as admin before each test
        await page.goto("http://127.0.0.1:8000/admin/manajemen-pengguna");
        await takeScreenshot(page, testGroup, testName, "01-login-page");

        await page.getByRole("textbox", { name: "Email" }).fill(adminEmail);
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(adminPassword);

        await takeScreenshot(page, testGroup, testName, "02-login-form-filled");

        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login
        await expect(
            page.getByRole("button", { name: "+ Tambah Pengguna" })
        ).toBeVisible();

        await takeScreenshot(
            page,
            testGroup,
            testName,
            "03-user-management-page"
        );
    });

    test("Create users with different roles", async ({ page }) => {
        const testGroup = "admin-management";
        const testName = "create-users";

        await takeScreenshot(page, testGroup, testName, "01-initial-user-list");

        for (const user of testUsers) {
            // Click add user button
            await page
                .getByRole("button", { name: "+ Tambah Pengguna" })
                .click();

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `02-add-user-form-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Fill user details
            await page.getByRole("textbox", { name: "Nama" }).fill(user.name);
            await page.locator('input[name="email"]').fill(user.email);
            await page.locator('input[name="password"]').fill(user.password);
            await page
                .locator('select[name="role_id"]')
                .selectOption(user.role_id);
            await page
                .locator('select[name="division_id"]')
                .selectOption(user.division_id);

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `03-form-filled-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Save the new user
            await page.getByRole("button", { name: "Simpan" }).click();

            // Wait for save operation to complete
            await page.waitForTimeout(1000);
            await takeScreenshot(
                page,
                testGroup,
                testName,
                `04-after-user-creation-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Verify user creation success
            await expect(page.getByText(user.name)).toBeVisible({
                timeout: 5000,
            });
            await expect(page.getByText(user.email)).toBeVisible();
            // await expect(page.getByText(user.role_name)).toBeVisible();
        }

        // Final screenshot of the user list with all created users
        await takeScreenshot(page, testGroup, testName, "05-final-user-list");
    });

    test("Edit user information", async ({ page }) => {
        const testGroup = "admin-management";
        const testName = "edit-users";

        await takeScreenshot(page, testGroup, testName, "01-initial-user-list");

        for (const user of testUsers) {
            // Wait for the user to be visible and locate it
            await page.getByText(user.name).waitFor();

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `02-before-editing-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            const userRow = page
                .getByRole("row", { name: user.name })
                .getByRole("button")
                .first();
            await userRow.click();

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `03-edit-form-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Update user name
            const updatedName = `${user.name} Updated`;
            await page.getByRole("textbox", { name: "Nama" }).fill(updatedName);

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `04-edit-form-filled-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Save changes
            await page.getByRole("button", { name: "Simpan" }).click();

            // Wait for update operation to complete
            await page.waitForTimeout(1000);
            await takeScreenshot(
                page,
                testGroup,
                testName,
                `05-after-user-update-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Verify the update was successful
            await expect(page.getByText(updatedName)).toBeVisible({
                timeout: 5000,
            });
        }

        // Final screenshot of the user list with all updated users
        await takeScreenshot(page, testGroup, testName, "06-final-user-list");
    });

    test("Delete user", async ({ page }) => {
        const testGroup = "admin-management";
        const testName = "delete-users";

        await takeScreenshot(page, testGroup, testName, "01-initial-user-list");

        // Locate and delete the second test user
        for (const user of testUsers) {
            // Wait for the user to be visible and locate it
            await page.getByText(user.name + " Updated").waitFor(); // Use updated name from previous test

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `02-before-deletion-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            const userRow = page
                .getByRole("row", { name: user.name + " Updated" })
                .getByRole("button")
                .nth(1); // The delete button is the second button (index 1)
            await userRow.click();

            await takeScreenshot(
                page,
                testGroup,
                testName,
                `03-delete-confirmation-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Confirm deletion
            await page.getByRole("button", { name: "Hapus" }).click();

            // Wait for deletion operation to complete
            await page.waitForTimeout(1000);
            await takeScreenshot(
                page,
                testGroup,
                testName,
                `04-after-user-deletion-${user.role_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );

            // Verify the user was deleted - wait for the confirmation or check that the user is no longer visible
            await expect(
                page.getByText(user.name + " Updated")
            ).not.toBeVisible({
                timeout: 5000,
            });
        }

        // Final screenshot of the user list after all deletions
        await takeScreenshot(page, testGroup, testName, "05-final-user-list");
    });
});
