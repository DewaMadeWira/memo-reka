import { test, expect } from "@playwright/test";

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
        // Login as admin before each test
        await page.goto("http://127.0.0.1:8000/admin/manajemen-pengguna");
        await page.getByRole("textbox", { name: "Email" }).fill(adminEmail);
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(adminPassword);
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login
        await expect(
            page.getByRole("button", { name: "+ Tambah Pengguna" })
        ).toBeVisible();
    });

    test("Create users with different roles", async ({ page }) => {
        for (const user of testUsers) {
            // Click add user button
            await page
                .getByRole("button", { name: "+ Tambah Pengguna" })
                .click();

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

            // Save the new user
            await page.getByRole("button", { name: "Simpan" }).click();

            // Verify user creation success
            await expect(page.getByText(user.name)).toBeVisible({
                timeout: 5000,
            });
            await expect(page.getByText(user.email)).toBeVisible();
            // await expect(page.getByText(user.role_name)).toBeVisible();
        }
    });

    test("Edit user information", async ({ page }) => {
        for (const user of testUsers) {
            // Wait for the user to be visible and locate it
            await page.getByText(user.name).waitFor();
            const userRow = page
                .getByRole("row", { name: user.name })
                .getByRole("button")
                .first();
            await userRow.click();

            // Update user name
            const updatedName = `${user.name} Updated`;
            await page.getByRole("textbox", { name: "Nama" }).fill(updatedName);

            // Save changes
            await page.getByRole("button", { name: "Simpan" }).click();

            // Verify the update was successful
            await expect(page.getByText(updatedName)).toBeVisible({
                timeout: 5000,
            });
        }
    });

    test("Delete user", async ({ page }) => {
        // Locate and delete the second test user
        for (const user of testUsers) {
            // Wait for the user to be visible and locate it
            await page.getByText(user.name + " Updated").waitFor(); // Use updated name from previous test
            const userRow = page
                .getByRole("row", { name: user.name + " Updated" })
                .getByRole("button")
                .nth(1); // The delete button is the second button (index 1)
            await userRow.click();

            // Confirm deletion
            await page.getByRole("button", { name: "Hapus" }).click();

            // Verify the user was deleted - wait for the confirmation or check that the user is no longer visible
            await expect(
                page.getByText(user.name + " Updated")
            ).not.toBeVisible({
                timeout: 5000,
            });
        }
    });
});
