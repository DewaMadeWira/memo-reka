import { test, expect } from "@playwright/test";

test.describe("Memo Management", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to login page
        await page.goto("http://127.0.0.1:8000/memo");

        // Login with test credentials
        await page
            .getByRole("textbox", { name: "Email" })
            .fill("phr@gmail.com");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill("password123");
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login by checking for the "Buat Memo" button
        await expect(
            page.getByRole("button", { name: "Buat Memo" })
        ).toBeVisible();
    });

    test("should create a new memo successfully", async ({ page }) => {
        // Click the "Buat Memo" button to start memo creation
        await page.getByRole("button", { name: "Buat Memo" }).click();

        // Fill in memo form details
        await page
            .locator('input[name="request_name"]')
            .fill("Permintaan Pengadaan Barang");
        await page
            .locator('input[name="perihal"]')
            .fill("Pengadaan Peralatan Kantor");
        await page
            .locator('textarea[name="content"]')
            .fill(
                "Mohon disetujui permintaan pengadaan peralatan kantor untuk kebutuhan departemen kita."
            );

        // Select officials and division from dropdowns
        await page.locator('select[name="official"]').selectOption("1");
        await page.locator('select[name="to_division"]').selectOption("2");

        // Submit the memo form
        await page.getByRole("button", { name: "Buat Memo" }).click();

        // Assertions to verify successful creation
        // Wait for redirect or success message
        // await expect(page.locator(".alert-success")).toBeVisible();
        // Verify the memo appears in the list or detail view
        await expect(
            page.getByText("Permintaan Pengadaan Barang")
        ).toBeVisible();

        // Optional: Verify memo status is set to initial stage
        // await expect(page.getByText("Memo Internal")).toBeVisible();
    });

    // test("should validate required fields when creating a memo", async ({
    //     page,
    // }) => {
    //     // Click the "Buat Memo" button
    //     await page.getByRole("button", { name: "Buat Memo" }).click();

    //     // Submit the form without filling any fields
    //     await page.getByRole("button", { name: "Buat Memo" }).click();

    //     // Verify validation errors appear
    //     // await expect(page.locator(".invalid-feedback")).toBeVisible();
    //     // await expect(page.locator(".invalid-feedback")).toContainText(
    //     //     "required"
    //     // );
    // });
});
