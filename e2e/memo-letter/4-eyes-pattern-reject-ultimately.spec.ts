import { test, expect } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";

test("4-eyes pattern memo rejection workflow - HR creates, Manager approves, Logistics rejects", async ({
    page,
}) => {
    // Create test results directory
    const testResultsDir = path.join(
        process.cwd(),
        "test-results",
        "4-eyes-rejection-workflow"
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

    // Navigate to create memo and fill form
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
        .fill("Memo 4 Eyes Pattern");
    await page.locator('input[name="perihal"]').fill("Perihal 4 Eyes Test");
    await page
        .locator('textarea[name="content"]')
        .fill("Isi memo untuk pengujian 4 eyes pattern");
    await page.locator('select[name="official"]').selectOption("1");
    await page.locator('select[name="to_division"]').selectOption("2");
    await page.locator('select[name="to_division"]').selectOption("3");
    await page.screenshot({
        path: path.join(testResultsDir, "04-memo-form-filled.png"),
    });

    // Submit memo
    await page.getByRole("button", { name: "Buat Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "05-memo-created.png"),
    });

    // Verify memo creation
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Memo 4 Eyes Pattern");
    await expect(page.getByText("Memo 4 Eyes Pattern")).toBeVisible();
    await page.screenshot({
        path: path.join(testResultsDir, "06-memo-verified-in-list.png"),
    });

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
    await page.screenshot({
        path: path.join(testResultsDir, "07-hr-employee-logged-out.png"),
    });

    // Step 2: Login as HR Manager for first approval
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
        path: path.join(testResultsDir, "08-hr-manager-logged-in.png"),
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
    await page.screenshot({
        path: path.join(testResultsDir, "09-hr-manager-memo-list.png"),
    });

    // Find and approve memo
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Memo 4 Eyes Pattern");

    // Wait for search results and click review button
    await page
        .getByRole("row", { name: /Memo 4 Eyes Pattern/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Memo 4 Eyes Pattern/ })
        .getByRole("button")
        .nth(2)
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Memo 4 Eyes Pattern/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "10-memo-review-modal-hr-manager.png"),
    });

    // Approve memo
    await page
        .getByRole("button", { name: "Setujui" })
        .nth(1)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Setujui" }).nth(1).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "11-memo-approved-by-hr-manager.png"),
    });

    // Close modal
    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tutup" }).click();

    // Logout HR Manager
    await page
        .getByRole("button", { name: "Manager HR" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Manager HR" }).click();
    await page
        .getByRole("button", { name: "Logout" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "12-hr-manager-logged-out.png"),
    });

    // Step 3: Login as Logistics Manager for final decision (rejection)
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
        path: path.join(testResultsDir, "13-logistics-manager-logged-in.png"),
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
    await page.screenshot({
        path: path.join(testResultsDir, "14-logistics-manager-memo-list.png"),
    });

    // Find and reject memo
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .fill("Memo 4 Eyes Pattern");

    // Wait for search results and click review button
    await page
        .getByRole("row", { name: /Memo 4 Eyes Pattern/ })
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Memo 4 Eyes Pattern/ })
        .getByRole("button")
        .nth(2)
        .waitFor({ state: "visible" });
    await page
        .getByRole("row", { name: /Memo 4 Eyes Pattern/ })
        .getByRole("button")
        .nth(2)
        .click();
    await page.screenshot({
        path: path.join(
            testResultsDir,
            "15-memo-review-modal-logistics-manager.png"
        ),
    });

    // Reject memo with reason
    await page
        .getByRole("button", { name: "Tolak" })
        .nth(2)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tolak" }).nth(2).click();
    await page.screenshot({
        path: path.join(testResultsDir, "16-rejection-modal.png"),
    });

    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .fill(
            "Memo tidak sesuai dengan kebijakan perusahaan dan perlu revisi menyeluruh"
        );
    await page.screenshot({
        path: path.join(testResultsDir, "17-rejection-reason-filled.png"),
    });

    await page.getByRole("button", { name: "Tolak Memo" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "18-memo-rejected-by-logistics.png"),
    });

    // Verify rejection reason is visible
    await page
        .getByRole("button", { name: "Lihat Alasan" })
        .nth(2)
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Lihat Alasan" }).nth(2).click();
    await page.screenshot({
        path: path.join(testResultsDir, "19-rejection-reason-modal.png"),
    });

    // Verify rejection reason content
    await expect(
        page.getByText(
            "Memo tidak sesuai dengan kebijakan perusahaan dan perlu revisi menyeluruh"
        )
    ).toBeVisible();
    await page.screenshot({
        path: path.join(testResultsDir, "20-rejection-reason-verified.png"),
    });

    // Close modals
    await page
        .getByRole("button", { name: "Tutup" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tutup" }).click();

    // Close remaining modals if any
    const closeButtons = page.getByRole("button", { name: "Tutup" });
    const closeButtonCount = await closeButtons.count();
    for (let i = 0; i < closeButtonCount; i++) {
        try {
            await closeButtons.nth(0).click({ timeout: 2000 });
            await page.waitForTimeout(500);
        } catch (error) {
            // Continue if button is not clickable
            break;
        }
    }

    await page.screenshot({
        path: path.join(testResultsDir, "21-workflow-completed.png"),
    });
});

// test("4-eyes pattern memo approval workflow - positive flow", async ({
//     page,
// }) => {
//     // Create test results directory
//     const testResultsDir = path.join(
//         process.cwd(),
//         "test-results",
//         "4-eyes-approval-workflow"
//     );
//     await mkdir(testResultsDir, { recursive: true });
//     // Step 1: Login as HR employee and create memo
//     await page.goto("http://127.0.0.1:8000/login");
//     await page.waitForLoadState("networkidle");

//     await page
//         .getByRole("textbox", { name: "Email" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
//     await page.getByRole("textbox", { name: "Password" }).fill("password123");
//     await page.getByRole("button", { name: "Log in" }).click();
//     await page.waitForLoadState("networkidle");
//     await page.screenshot({
//         path: path.join(testResultsDir, "01-hr-employee-logged-in.png"),
//     });

//     // Create memo for approval workflow
//     await page
//         .getByRole("button", { name: "Buat Memo" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Buat Memo" }).click();

//     await page
//         .locator('input[name="request_name"]')
//         .waitFor({ state: "visible" });
//     await page
//         .locator('input[name="request_name"]')
//         .fill("Memo 4 Eyes Approved");
//     await page.locator('input[name="perihal"]').fill("Perihal Memo Disetujui");
//     await page
//         .locator('textarea[name="content"]')
//         .fill("Memo yang akan disetujui dalam 4 eyes pattern");
//     await page.locator('select[name="official"]').selectOption("1");
//     await page.locator('select[name="to_division"]').selectOption("2");
//     await page.locator('select[name="to_division"]').selectOption("3");
//     await page.screenshot({
//         path: path.join(testResultsDir, "02-memo-form-filled.png"),
//     });

//     await page.getByRole("button", { name: "Buat Memo" }).click();
//     await page.waitForLoadState("networkidle");
//     await page.screenshot({
//         path: path.join(testResultsDir, "03-memo-created.png"),
//     });

//     // Logout HR employee
//     await page
//         .getByRole("button", { name: "Pegawai HR" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Pegawai HR" }).click();
//     await page
//         .getByRole("button", { name: "Logout" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Logout" }).click();
//     await page.waitForLoadState("networkidle");

//     // Step 2: Login as HR Manager for first approval
//     await page
//         .getByRole("link", { name: "Log in" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("link", { name: "Log in" }).click();
//     await page.waitForLoadState("networkidle");

//     await page
//         .getByRole("textbox", { name: "Email" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
//     await page.getByRole("textbox", { name: "Password" }).fill("password123");
//     await page.getByRole("button", { name: "Log in" }).click();
//     await page.waitForLoadState("networkidle");
//     await page.screenshot({
//         path: path.join(testResultsDir, "04-hr-manager-logged-in.png"),
//     });

//     // Navigate and approve memo
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
//         .fill("Memo 4 Eyes Approved");

//     await page
//         .getByRole("row", { name: /Memo 4 Eyes Approved/ })
//         .waitFor({ state: "visible" });
//     await page
//         .getByRole("row", { name: /Memo 4 Eyes Approved/ })
//         .getByRole("button")
//         .nth(2)
//         .click();

//     await page
//         .getByRole("button", { name: "Setujui" })
//         .nth(1)
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Setujui" }).nth(1).click();
//     await page.waitForLoadState("networkidle");
//     await page.screenshot({
//         path: path.join(testResultsDir, "05-first-approval-completed.png"),
//     });

//     await page
//         .getByRole("button", { name: "Tutup" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Tutup" }).click();

//     // Logout HR Manager
//     await page
//         .getByRole("button", { name: "Manager HR" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Manager HR" }).click();
//     await page
//         .getByRole("button", { name: "Logout" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Logout" }).click();
//     await page.waitForLoadState("networkidle");

//     // Step 3: Login as Logistics Manager for final approval
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
//     await page.screenshot({
//         path: path.join(testResultsDir, "06-logistics-manager-logged-in.png"),
//     });

//     // Navigate and give final approval
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
//         .fill("Memo 4 Eyes Approved");

//     await page
//         .getByRole("row", { name: /Memo 4 Eyes Approved/ })
//         .waitFor({ state: "visible" });
//     await page
//         .getByRole("row", { name: /Memo 4 Eyes Approved/ })
//         .getByRole("button")
//         .nth(2)
//         .click();

//     await page
//         .getByRole("button", { name: "Setujui" })
//         .nth(1)
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Setujui" }).nth(1).click();
//     await page.waitForLoadState("networkidle");
//     await page.screenshot({
//         path: path.join(testResultsDir, "07-final-approval-completed.png"),
//     });

//     // Verify memo is fully approved
//     await page
//         .getByRole("button", { name: "Tutup" })
//         .waitFor({ state: "visible" });
//     await page.getByRole("button", { name: "Tutup" }).click();
//     await page.screenshot({
//         path: path.join(
//             testResultsDir,
//             "08-4-eyes-approval-workflow-completed.png"
//         ),
//     });
// });
