import { test, expect } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";

test("4-eyes pattern: memo rejection and ultimate approval workflow", async ({
    page,
}) => {
    // Create test results directory
    const testResultsDir = path.join(
        process.cwd(),
        "test-results",
        "4-eyes-pattern-workflow"
    );
    await mkdir(testResultsDir, { recursive: true });

    // Step 1: Login as HR employee and create memo
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
        path: path.join(testResultsDir, "02-hr-employee-logged-in.png"),
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
    await page
        .locator('input[name="request_name"]')
        .fill("memo 4 eyes approved");
    await page.locator('input[name="perihal"]').fill("perihal memo 4 mata");
    await page
        .locator('textarea[name="content"]')
        .fill("Isi memo untuk testing 4 eyes pattern");
    await page.locator('select[name="official"]').selectOption("2");
    await page.locator('select[name="to_division"]').selectOption("2");
    await page.locator('select[name="to_division"]').selectOption("3");
    await page.screenshot({
        path: path.join(testResultsDir, "04-memo-form-filled.png"),
    });

    await page.getByRole("button", { name: "Buat Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "05-memo-created.png"),
    });

    // Verify memo creation
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("4 eyes");
    await expect(page.getByText("memo 4 eyes approved")).toBeVisible();

    // Logout HR employee
    await page
        .getByRole("button", { name: "Pegawai HR" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Pegawai HR" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // Step 2: Login as Manager HR and approve memo
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
        path: path.join(testResultsDir, "06-manager-hr-logged-in.png"),
    });

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

    // Find and approve memo
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("4 e");

    await page
        .getByRole("row", { name: /memo 4 eyes approved/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /memo 4 eyes approved/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "07-manager-hr-review-modal.png"),
    });

    await page
        .getByRole("button", { name: "Setujui" })
        .nth(1)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();

    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tutup" }).click();
    await page.screenshot({
        path: path.join(testResultsDir, "08-manager-hr-approved.png"),
    });

    // Logout Manager HR
    await page
        .getByRole("button", { name: "Manager HR" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Manager HR" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // Step 3: Login as Manager LOG and approve memo
    await page
        .getByRole("link", { name: "Log in" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("mlog@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "09-manager-log-logged-in.png"),
    });

    // Navigate to memo and approve
    await page
        .getByRole("button", { name: "Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Memo" }).click();
    await page
        .getByRole("link", { name: "Semua Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("4 e");

    await page
        .getByRole("row", { name: /memo 4 eyes approved/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /memo 4 eyes approved/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "10-manager-log-review-modal.png"),
    });

    await page
        .getByRole("button", { name: "Setujui" })
        .nth(1)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();

    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tutup" }).click();
    await page.screenshot({
        path: path.join(testResultsDir, "11-manager-log-approved.png"),
    });

    // Logout Manager LOG
    await page
        .getByRole("button", { name: "Manager LOG" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Manager LOG" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // Step 4: Login as Pegawai LOG - reject first time
    await page
        .getByRole("link", { name: "Log in" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("plog@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "12-pegawai-log-logged-in.png"),
    });

    // Navigate to memo and initially reject
    await page
        .getByRole("button", { name: "Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Memo" }).click();
    await page
        .getByRole("link", { name: "Semua Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("4 eye");

    await page
        .getByRole("row", { name: /memo 4 eyes approved/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /memo 4 eyes approved/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "13-pegawai-log-review-modal.png"),
    });

    // Upload files as part of the workflow
    await page
        .getByRole("button", { name: "Unggah File" })
        .nth(2)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Unggah File" }).nth(2).click();

    await page
        .getByRole("button", { name: "Upload Bukti" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Upload Bukti" }).click();

    // Set input files (assuming these files exist in the test environment)
    // await page
    //     .getByRole("button", { name: "Upload Bukti" })
    //     .setInputFiles(["images.jpeg", "servers.jpeg"]);
    await page
        .getByRole("button", { name: "Upload Bukti" })
        .setInputFiles([
            "C:\\Users\\ADMIN\\Downloads\\bukti\\images.jpeg",
            "C:\\Users\\ADMIN\\Downloads\\bukti\\servers.jpeg",
        ]);

    await page.getByRole("button", { name: "Upload", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "14-files-uploaded.png"),
    });

    // Close notification if it appears
    const notificationButton = page
        .getByLabel("Notifications (F8)")
        .locator("button");
    if (await notificationButton.isVisible()) {
        await notificationButton.click();
    }

    // Finally approve the memo
    await page
        .getByRole("button", { name: "Setujui" })
        .nth(1)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();

    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tutup" }).click();
    await page.screenshot({
        path: path.join(testResultsDir, "15-pegawai-log-approved.png"),
    });

    // Logout Pegawai LOG
    await page
        .getByRole("button", { name: "Pegawai LOG" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Pegawai LOG" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // Step 5: Final verification by Manager LOG
    await page
        .getByRole("link", { name: "Log in" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Email" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Email" }).fill("mlog@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "16-manager-log-final-login.png"),
    });

    // Navigate to memo for final review
    await page
        .getByRole("button", { name: "Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Memo" }).click();
    await page
        .getByRole("link", { name: "Semua Memo" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Memo" }).click();
    await page.waitForLoadState("networkidle");

    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("4 e");

    // View uploaded files
    await page
        .getByRole("cell")
        .filter({ hasText: /^$/ })
        .getByRole("button")
        .nth(4)
        .waitFor({ state: "visible" });
    await page
        .getByRole("cell")
        .filter({ hasText: /^$/ })
        .getByRole("button")
        .nth(4)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "17-view-uploaded-files.png"),
    });

    // Navigate through uploaded images
    const nextImageButton = page.getByLabel("Next image").nth(1);
    if (await nextImageButton.isVisible()) {
        await nextImageButton.click();
        await page.screenshot({
            path: path.join(testResultsDir, "18-next-image-viewed.png"),
        });
    }

    // Go back to memo list
    await page.getByText("Kembali").nth(1).click();
    await page.waitForLoadState("networkidle");

    // Final approval
    await page
        .getByRole("cell")
        .filter({ hasText: /^$/ })
        .getByRole("button")
        .nth(1)
        .waitFor({ state: "visible" });
    await page
        .getByRole("cell")
        .filter({ hasText: /^$/ })
        .getByRole("button")
        .nth(1)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "19-final-approval-modal.png"),
    });

    await page
        .getByRole("button", { name: "Setujui" })
        .nth(1)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();

    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tutup" }).click();
    await page.screenshot({
        path: path.join(testResultsDir, "20-workflow-completed.png"),
    });

    // Verify the memo is fully approved
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("4 e");

    // Check that memo status shows as approved (this would depend on your UI implementation)
    await expect(page.getByText("memo 4 eyes approved")).toBeVisible();
    await page.screenshot({
        path: path.join(testResultsDir, "21-final-verification.png"),
    });
});

// test("4-eyes pattern: memo creation and immediate approval workflow", async ({
//     page,
// }) => {
//     // Create test results directory
//     const testResultsDir = path.join(
//         process.cwd(),
//         "test-results",
//         "4-eyes-immediate-approval"
//     );
//     await mkdir(testResultsDir, { recursive: true });

//     // Step 1: Create memo as HR employee
//     await page.goto("http://127.0.0.1:8000/login");
//     await page.waitForLoadState("networkidle");

//     await page
//         .getByRole("textbox", { name: "Email" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
//     await page.getByRole("textbox", { name: "Password" }).fill("password123");
//     await page.getByRole("button", { name: "Log in" }).click();
//     await page.waitForLoadState("networkidle");

//     // Create memo
//     await page
//         .getByRole("button", { name: "Buat Memo" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Buat Memo" }).click();

//     await page
//         .locator('input[name="request_name"]')
//         .waitFor({ state: "visible" });
//     await page
//         .locator('input[name="request_name"]')
//         .fill("memo 4 eyes quick approval");
//     await page.locator('input[name="perihal"]').fill("perihal quick approval");
//     await page
//         .locator('textarea[name="content"]')
//         .fill("Quick approval test content");
//     await page.locator('select[name="official"]').selectOption("2");
//     await page.locator('select[name="to_division"]').selectOption("2");
//     await page.locator('select[name="to_division"]').selectOption("3");

//     await page.getByRole("button", { name: "Buat Memo" }).click();
//     await page.waitForLoadState("networkidle");
//     await page.screenshot({
//         path: path.join(testResultsDir, "01-memo-created-quick.png"),
//     });

//     // Logout HR
//     await page
//         .getByRole("button", { name: "Pegawai HR" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Pegawai HR" }).click();
//     await page
//         .getByRole("button", { name: "Logout" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Logout" }).click();
//     await page.waitForLoadState("networkidle");

//     // Quick approval by all parties
//     const approvers = [
//         { email: "mhr@gmail.com", role: "Manager HR" },
//         { email: "mlog@gmail.com", role: "Manager LOG" },
//         { email: "plog@gmail.com", role: "Pegawai LOG" },
//     ];

//     for (let i = 0; i < approvers.length; i++) {
//         const approver = approvers[i];

//         // Login
//         await page
//             .getByRole("link", { name: "Log in" })
//             .waitFor({ state: "visible" });
//         await page.getByRole("link", { name: "Log in" }).click();
//         await page.waitForLoadState("networkidle");

//         await page
//             .getByRole("textbox", { name: "Email" })
//             .waitFor({ state: "visible" });
//         await page.getByRole("textbox", { name: "Email" }).fill(approver.email);
//         await page
//             .getByRole("textbox", { name: "Password" })
//             .fill("password123");
//         await page.getByRole("button", { name: "Log in" }).click();
//         await page.waitForLoadState("networkidle");

//         // Navigate to memo
//         await page
//             .getByRole("button", { name: "Memo" })
//             .waitFor({ state: "visible" });
//         await page.getByRole("button", { name: "Memo" }).click();
//         await page
//             .getByRole("link", { name: "Semua Memo" })
//             .waitFor({ state: "visible" });
//         await page.getByRole("link", { name: "Semua Memo" }).click();
//         await page.waitForLoadState("networkidle");

//         // Find and approve memo
//         await page
//             .getByRole("textbox", { name: "Cari Surat" })
//             .waitFor({ state: "visible" });
//         await page
//             .getByRole("textbox", { name: "Cari Surat" })
//             .fill("quick approval");

//         await page
//             .getByRole("row", { name: /memo 4 eyes quick approval/ })
//             .waitFor({ state: "visible" });
//         await page
//             .getByRole("row", { name: /memo 4 eyes quick approval/ })
//             .getByRole("button")
//             .nth(2)
//             .click();

//         await page
//             .getByRole("button", { name: "Setujui" })
//             .nth(1)
//             .waitFor({ state: "visible" });
//         await page.getByRole("button", { name: "Setujui" }).nth(1).click();

//         await page
//             .getByRole("button", { name: "Tutup" })
//             .waitFor({ state: "visible" });
//         await page.getByRole("button", { name: "Tutup" }).click();

//         await page.screenshot({
//             path: path.join(
//                 testResultsDir,
//                 `0${i + 2}-${approver.role
//                     .toLowerCase()
//                     .replace(" ", "-")}-approved.png`
//             ),
//         });

//         // Logout
//         await page
//             .getByRole("button", { name: approver.role })
//             .waitFor({ state: "visible" });
//         await page.getByRole("button", { name: approver.role }).click();
//         await page
//             .getByRole("button", { name: "Logout" })
//             .waitFor({ state: "visible" });
//         await page.getByRole("button", { name: "Logout" }).click();
//         await page.waitForLoadState("networkidle");
//     }

//     // Final verification - login as any user to check memo status
//     await page
//         .getByRole("link", { name: "Log in" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("link", { name: "Log in" }).click();
//     await page.waitForLoadState("networkidle");

//     await page
//         .getByRole("textbox", { name: "Email" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("textbox", { name: "Email" }).fill("mlog@gmail.com");
//     await page.getByRole("textbox", { name: "Password" }).fill("password123");
//     await page.getByRole("button", { name: "Log in" }).click();
//     await page.waitForLoadState("networkidle");

//     await page
//         .getByRole("button", { name: "Memo" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Memo" }).click();
//     await page
//         .getByRole("link", { name: "Semua Memo" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("link", { name: "Semua Memo" }).click();
//     await page.waitForLoadState("networkidle");

//     await page
//         .getByRole("textbox", { name: "Cari Surat" })
//         .waitFor({ state: "visible" });
//     await page
//         .getByRole("textbox", { name: "Cari Surat" })
//         .fill("quick approval");

//     // Verify memo is visible and fully approved
//     await expect(page.getByText("memo 4 eyes quick approval")).toBeVisible();
//     await page.screenshot({
//         path: path.join(testResultsDir, "05-final-verification-complete.png"),
//     });
// });
