import { test, expect } from "@playwright/test";

test("memo creation, rejection, and review workflow", async ({ page }) => {
    // Step 1: Login as HR employee and create memo
    await page.goto("http://127.0.0.1:8000/memo");
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    // Navigate to memo page and create new memo
    // await page.goto('http://127.0.0.1:8000/memo');
    await page.getByRole("button", { name: "Buat Memo" }).click();

    // Fill memo details
    await page
        .locator('input[name="request_name"]')
        .fill("Permintaan Memo Test 1");
    await page.locator('input[name="perihal"]').fill("Perihal Test Memo");
    await page
        .locator('textarea[name="content"]')
        .fill("Isi dari memo untuk pengujian");
    await page.locator('select[name="official"]').selectOption("4");
    await page.locator('select[name="to_division"]').selectOption("3");

    // Submit memo
    await page.getByRole("button", { name: "Buat Memo" }).click();

    // Verify memo appears in list
    // await page.getByRole('button', { name: 'Nomor' }).click();
    // await page.getByRole('button', { name: 'Nomor' }).click();
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Permintaan Memo Test 1");
    await expect(page.getByText("Permintaan Memo Test")).toBeVisible();

    // Logout
    await page.getByRole("button", { name: "Pegawai HR" }).click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Step 2: Login as manager and review memo
    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    // Navigate to memo review
    await page.getByRole("button", { name: "Memo" }).click();
    await page.getByRole("link", { name: "Semua Memo" }).click();

    // Find and review the created memo
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Permintaan Memo Test 1");
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .getByRole("button")
        .nth(2)
        .click();

    // Reject the memo with reason
    await page.getByRole("button", { name: "Tolak" }).nth(2).click();
    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .fill("Memo tidak sesuai dengan format standar");
    await page.getByRole("button", { name: "Tolak Memo" }).click();

    // Close any modal/dialog
    await page.getByRole("button", { name: "Tutup" }).click();

    // Logout manager
    await page.getByRole("button", { name: "Manager HR" }).click();
    await page.getByRole("button", { name: "Logout" }).click();

    // Step 3: Login back as HR employee to check rejection reason
    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    // Navigate to memo list
    await page.getByRole("button", { name: "Memo" }).click();
    await page.getByRole("link", { name: "Semua Memo" }).click();

    // Find the rejected memo and view rejection reason
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Permintaan Memo Test 1");
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.getByRole("button", { name: "Lihat Alasan" }).nth(2).click();

    // Verify rejection reason is displayed
    await expect(
        page.getByText("Memo tidak sesuai dengan format standar")
    ).toBeVisible();

    // Close dialogs
    // await page.getByRole("button", { name: "Tutup" }).click();
    // await page.getByRole("button", { name: "Tutup" }).click();
});

test("memo approval workflow", async ({ page }) => {
    // Test the positive flow where memo gets approved
    await page.goto("http://127.0.0.1:8000/memo");
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    // Create memo
    // await page.goto('http://127.0.0.1:8000/memo');
    await page.getByRole("button", { name: "Buat Memo" }).click();

    await page.locator('input[name="request_name"]').fill("Memo Disetujui");
    await page.locator('input[name="perihal"]').fill("Perihal Memo Disetujui");
    await page
        .locator('textarea[name="content"]')
        .fill("Memo yang akan disetujui");
    await page.locator('select[name="official"]').selectOption("4");
    await page.locator('select[name="to_division"]').selectOption("3");

    await page.getByRole("button", { name: "Buat Memo" }).click();

    // Logout and login as manager
    await page.getByRole("button", { name: "Pegawai HR" }).click();
    await page.getByRole("button", { name: "Logout" }).click();

    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();

    // Approve memo
    await page.getByRole("button", { name: "Memo" }).click();
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Memo Disetujui");

    await page
        .getByRole("row", { name: /Memo Disetujui/ })
        .getByRole("button")
        .nth(2)
        .click();
    // await page.getByRole('button', { name: 'Setujui' }).nth(2).click();
    // await page.getByRole("button", { name: "Setujui" }).nth(1).click();

    // Verify approval success
    // await expect(page.getByText(/berhasil disetujui/i)).toBeVisible();
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();
    // Wait for the specific memo approval endpoint
    // const approvalResponse = page.waitForResponse(
    //     (response) =>
    //         response.url().includes("/approve") ||
    //         (response.url().includes("/memo") &&
    //             response.request().method() === "PATCH")
    // );
    await page.waitForTimeout(500);

    // // Verify the approval was successful
    // const response = await approvalResponse;
    // expect(response.ok()).toBeTruthy();
});
