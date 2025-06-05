import { test, expect } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";

test("memo creation, rejection, and review workflow", async ({ page }) => {
    // Create test results directory
    const testResultsDir = path.join(
        process.cwd(),
        "test-results",
        "memo-workflow"
    );
    await mkdir(testResultsDir, { recursive: true });

    // Step 1: Login as HR employee and create memo
    await page.goto("http://127.0.0.1:8000/memo");
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    // Navigate to memo page and create new memo
    await page
        .getByRole("button", { name: "Buat Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Buat Memo" }).click();
    await page.screenshot({
        path: path.join(testResultsDir, "01-create-memo-form.png"),
    });

    // Fill memo details
    await page
        .locator('input[name="request_name"]')
        .waitFor({ state: "visible" });
    await page
        .locator('input[name="request_name"]')
        .fill("Permintaan Memo Test 1");
    await page.locator('input[name="perihal"]').fill("Perihal Test Memo");
    await page
        .locator('textarea[name="content"]')
        .fill("Isi dari memo untuk pengujian");
    await page.locator('select[name="official"]').selectOption("4");
    await page.locator('select[name="to_division"]').selectOption("3");
    await page.screenshot({
        path: path.join(testResultsDir, "02-memo-form-filled.png"),
    });

    // Submit memo
    await page.getByRole("button", { name: "Buat Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "03-memo-created.png"),
    });

    // Verify memo appears in list
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Permintaan Memo Test 1");
    await expect(page.getByText("Permintaan Memo Test")).toBeVisible();
    await page.screenshot({
        path: path.join(testResultsDir, "04-memo-in-list.png"),
    });

    // Logout
    await page
        .getByRole("button", { name: "Pegawai HR" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Pegawai HR" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // Step 2: Login as manager and review memo
    await page
        .getByRole("link", { name: "Log in" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    // Navigate to memo review
    await page
        .getByRole("button", { name: "Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Memo" }).click();
    await page
        .getByRole("link", { name: "Semua Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "05-manager-memo-list.png"),
    });

    // Find and review the created memo
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Permintaan Memo Test 1");

    // Wait for search results to appear
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .getByRole("button")
        .nth(2)
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "06-memo-review-modal.png"),
    });

    // Reject the memo with reason
    await page
        .getByRole("button", { name: "Tolak" })
        .nth(2)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tolak" }).nth(2).click();
    await page.screenshot({
        path: path.join(testResultsDir, "07-rejection-modal.png"),
    });

    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .fill("Memo tidak sesuai dengan format standar");
    await page.screenshot({
        path: path.join(testResultsDir, "08-rejection-reason-filled.png"),
    });

    await page.getByRole("button", { name: "Tolak Memo" }).click();
    // Wait for rejection to be processed by waiting for close button to appear
    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.screenshot({
        path: path.join(testResultsDir, "09-memo-rejected.png"),
    });

    // Close any modal/dialog
    await page.getByRole("button", { name: "Tutup" }).click();

    // Logout manager
    await page
        .getByRole("button", { name: "Manager HR" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Manager HR" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // Step 3: Login back as HR employee to check rejection reason
    await page
        .getByRole("link", { name: "Log in" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    // Navigate to memo list
    await page
        .getByRole("button", { name: "Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Memo" }).click();
    await page
        .getByRole("link", { name: "Semua Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page.waitForLoadState("networkidle");

    // Find the rejected memo and view rejection reason
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Permintaan Memo Test 1");

    // Wait for search results to appear
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .getByRole("button")
        .nth(2)
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Permintaan Memo Test 1/ })
        .getByRole("button")
        .nth(2)
        .click();

    await page
        .getByRole("button", { name: "Lihat Alasan" })
        .nth(2)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Lihat Alasan" }).nth(2).click();
    await page.screenshot({
        path: path.join(testResultsDir, "10-rejection-reason-modal.png"),
    });

    // Verify rejection reason is displayed
    await expect(
        page.getByText("Memo tidak sesuai dengan format standar")
    ).toBeVisible();
    await page.screenshot({
        path: path.join(testResultsDir, "17-rejection-reason-verified.png"),
    });
});

test("memo approval workflow", async ({ page }) => {
    // Create test results directory
    const testResultsDir = path.join(
        process.cwd(),
        "test-results",
        "memo-approval"
    );
    await mkdir(testResultsDir, { recursive: true });

    // Test the positive flow where memo gets approved
    await page.goto("http://127.0.0.1:8000/memo");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "01-login-page.png"),
    });

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "02-hr-logged-in.png"),
    });

    // Create memo
    await page
        .getByRole("button", { name: "Buat Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Buat Memo" }).click();
    await page.screenshot({
        path: path.join(testResultsDir, "03-create-memo-form.png"),
    });

    await page
        .locator('input[name="request_name"]')
        .waitFor({ state: "visible" });
    await page.locator('input[name="request_name"]').fill("Memo Disetujui");
    await page.locator('input[name="perihal"]').fill("Perihal Memo Disetujui");
    await page
        .locator('textarea[name="content"]')
        .fill("Memo yang akan disetujui");
    await page.locator('select[name="official"]').selectOption("4");
    await page.locator('select[name="to_division"]').selectOption("3");
    await page.screenshot({
        path: path.join(testResultsDir, "04-memo-form-filled.png"),
    });

    await page.getByRole("button", { name: "Buat Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "05-memo-created.png"),
    });

    // Logout and login as manager
    await page
        .getByRole("button", { name: "Pegawai HR" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Pegawai HR" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "06-hr-logged-out.png"),
    });

    await page
        .getByRole("link", { name: "Log in" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "07-manager-logged-in.png"),
    });

    // Approve memo
    await page
        .getByRole("button", { name: "Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Memo" }).click();
    await page
        .getByRole("link", { name: "Semua Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "08-manager-memo-list.png"),
    });

    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Memo Disetujui");

    // Wait for search results to appear
    await page
        .getByRole("row", { name: /Memo Disetujui/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Memo Disetujui/ })
        .getByRole("button")
        .nth(2)
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Memo Disetujui/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "09-memo-review-modal.png"),
    });

    await page
        .getByRole("button", { name: "Setujui" })
        .nth(1)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();

    // Wait for approval to be processed - look for success indicator or modal change
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "10-memo-approved.png"),
    });
});
