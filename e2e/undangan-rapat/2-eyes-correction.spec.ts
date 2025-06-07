import { test, expect } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";

test("undangan rapat creation, rejection, and correction workflow", async ({
    page,
}) => {
    // Create test results directory
    const testResultsDir = path.join(
        process.cwd(),
        "test-results",
        "undangan-rapat-workflow"
    );
    await mkdir(testResultsDir, { recursive: true });

    // Step 1: Login as HR employee and create undangan rapat
    await page.goto("http://127.0.0.1:8000/undangan-rapat");
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

    // Navigate to create undangan rapat
    await page
        .getByRole("button", { name: "Buat Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Buat Undangan Rapat" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "03-create-undangan-form.png"),
    });

    // Fill undangan rapat details
    await page
        .locator('input[name="request_name"]')
        .waitFor({ state: "visible" });
    await page
        .locator('input[name="request_name"]')
        .fill("undangan correction");
    await page.locator('input[name="perihal"]').fill("perihal");
    await page.locator('textarea[name="content"]').fill("isi");
    await page.locator('input[name="hari_tanggal"]').fill("2025-06-06");
    await page.locator('input[name="waktu"]').fill("9 Am");
    await page.locator('input[name="tempat"]').fill("Lokasi");
    await page.locator('input[name="agenda"]').fill("Pengadaan");
    await page.locator('select[name="official"]').selectOption("2");
    await page.locator('select[name="to_division"]').selectOption("1");
    await page.screenshot({
        path: path.join(testResultsDir, "04-undangan-form-filled.png"),
    });

    // Navigate to undangan rapat list to add participants
    // await page.goto("http://127.0.0.1:8000/undangan-rapat");
    // await page.waitForLoadState("networkidle");
    // await page.screenshot({
    //     path: path.join(testResultsDir, "05-undangan-list-page.png"),
    // });

    // Add participant
    // await page
    //     .getByRole("textbox", { name: "Search users..." })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("textbox", { name: "Search users..." }).click();
    // getByRole('checkbox', { name: 'Jane Smith (HR-GA)' })

    await page
        .getByRole("checkbox", { name: "Jane Smith" })
        .waitFor({ state: "visible" });
    await page.getByRole("checkbox", { name: "Jane Smith" }).check();
    await page.screenshot({
        path: path.join(testResultsDir, "06-participant-selected.png"),
    });
    await page.getByRole("button", { name: "Buat Undangan Rapat" }).click();

    // Go back to undangan list and verify creation
    //     await page.goto("http://127.0.0.1:8000/undangan-rapat");
    //     await page.waitForLoadState("networkidle");
    // await page.goto('http://127.0.0.1:8000/login');Manager
    // getByRole('button', { name: 'Pegawai HR' })
    // await page
    //     .getByRole("button", { name: "Pegawai HR" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("button", { name: "Pegawai HR" }).click();
    // await page
    //     .getByRole("button", { name: "Logout" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("button", { name: "Logout" }).click();
    // await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Pegawai HR" }).click();
    await page.getByRole("button", { name: "Logout" }).click();

    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill("phr@gmail.com");
    await page.getByRole("textbox", { name: "Email" }).press("Tab");
    await page.getByRole("textbox", { name: "Password" }).fill("password123");
    await page.getByRole("textbox", { name: "Password" }).press("Enter");
    await page.getByRole("button", { name: "Undangan Rapat" }).click();
    // Search for created undangan
    await page.getByRole("link", { name: "Semua Undangan Rapat" }).click();
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("undan");
    await page.screenshot({
        path: path.join(testResultsDir, "07-search-undangan.png"),
    });

    // View undangan details
    await page
        .getByRole("table")
        .getByRole("button")
        .filter({ hasText: /^$/ })
        .nth(4)
        .waitFor({ state: "visible" });
    await page
        .getByRole("table")
        .getByRole("button")
        .filter({ hasText: /^$/ })
        .nth(4)
        .click();
    await page.screenshot({
        path: path.join(testResultsDir, "08-undangan-details.png"),
    });

    // Go back and logout
    await page
        .getByRole("button", { name: "Kembali" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Kembali" }).click();
    await page.waitForLoadState("networkidle");

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
        path: path.join(testResultsDir, "09-hr-logged-out.png"),
    });

    // Step 2: Login as manager and reject undangan
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
        path: path.join(testResultsDir, "10-manager-logged-in.png"),
    });

    // Navigate to undangan rapat review
    await page
        .getByRole("button", { name: "Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Undangan Rapat" }).click();
    await page
        .getByRole("link", { name: "Semua Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Undangan Rapat" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "11-manager-undangan-list.png"),
    });

    // Search for the undangan to reject
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("unda");

    // Reject the undangan
    await page.locator(".bg-red-500").waitFor({ state: "visible" });
    await page.locator(".bg-red-500").click();
    await page.screenshot({
        path: path.join(testResultsDir, "12-rejection-modal.png"),
    });

    // Fill rejection reason
    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .waitFor({ state: "visible" });
    await page
        .getByRole("textbox", { name: "Alasan penolakan..." })
        .fill("undangan tidak sesuai");
    await page.screenshot({
        path: path.join(testResultsDir, "13-rejection-reason-filled.png"),
    });

    await page
        .getByRole("button", { name: "Tolak Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Tolak Undangan Rapat" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "14-undangan-rejected.png"),
    });

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

    // Step 3: Login back as HR employee to correct the undangan
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
    await page.screenshot({
        path: path.join(testResultsDir, "15-hr-back-logged-in.png"),
    });

    // Navigate to undangan list to make corrections
    await page
        .getByRole("button", { name: "Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Undangan Rapat" }).click();
    await page
        .getByRole("link", { name: "Semua Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Undangan Rapat" }).click();
    await page.waitForLoadState("networkidle");

    // Search and edit the rejected undangan
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("undanga");

    // Click edit button
    await page.locator("button:nth-child(4)").waitFor({ state: "visible" });
    await page.locator("button:nth-child(4)").click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "16-edit-undangan-form.png"),
    });

    // Make corrections to the undangan
    await page.locator('input[name="perihal"]').waitFor({ state: "visible" });
    await page.locator('input[name="perihal"]').dblclick();
    await page.locator('input[name="perihal"]').press("ArrowRight");
    await page.locator('input[name="perihal"]').fill("perihal diperbaiki");
    await page.screenshot({
        path: path.join(testResultsDir, "17-perihal-corrected.png"),
    });

    // Submit the corrections
    await page
        .getByRole("button", { name: "Ubah Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Ubah Undangan Rapat" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "18-undangan-updated.png"),
    });
    // await page
    //     .getByRole("button", { name: "Pegawai HR" })
    //     .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Pegawai HR" }).click();
    // await page
    //     .getByRole("button", { name: "Logout" })
    //     .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForLoadState("networkidle");

    // await page
    //     .getByRole("link", { name: "Log in" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("link", { name: "Log in" }).click();
    // await page.waitForLoadState("networkidle");

    // await page
    //     .getByRole("textbox", { name: "Email" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("textbox", { name: "Email" }).fill("mhr@gmail.com");
    // await page.getByRole("textbox", { name: "Password" }).fill("password123");
    // await page.getByRole("button", { name: "Log in" }).click();
    // await page.waitForLoadState("networkidle");

    // // Search for the corrected undangan and send it for approval
    // await page
    //     .getByRole("textbox", { name: "Cari Surat" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("textbox", { name: "Cari Surat" }).fill("undan");

    // Send the corrected undangan
    // await page
    //     .locator(".bg-green-500 > button")
    //     .first()
    //     .waitFor({ state: "visible" });
    // await page.locator(".bg-green-500 > button").first().click();
    // await page.screenshot({
    //     path: path.join(testResultsDir, "19-send-undangan-modal.png"),
    // });

    // await page
    //     .getByRole("button", { name: "Kirim Undangan Rapat ke" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("button", { name: "Kirim Undangan Rapat ke" }).click();
    // await page.waitForLoadState("networkidle");
    // await page.screenshot({
    //     path: path.join(testResultsDir, "19-send-undangan-modal.png"),
    // });

    // await page
    //     .getByRole("button", { name: "Kirim Undangan Rapat ke" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("button", { name: "Kirim Undangan Rapat ke" }).click();
    // await page.waitForLoadState("networkidle");
    // await page.screenshot({
    //     path: path.join(testResultsDir, "20-undangan-sent.png"),
    // });

    // Logout HR employee
    // await page
    //     .getByRole("button", { name: "Pegawai HR" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("button", { name: "Pegawai HR" }).click();
    // await page
    //     .getByRole("button", { name: "Logout" })
    //     .waitFor({ state: "visible" });
    // await page.getByRole("button", { name: "Logout" }).click();
    // await page.waitForLoadState("networkidle");

    // Step 4: Login as manager again to approve the corrected undangan
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
        path: path.join(testResultsDir, "21-manager-final-login.png"),
    });

    // Navigate to dashboard and then to undangan rapat
    // await page.getByText("DashboardMemoUndangan").click();
    await page
        .getByRole("button", { name: "Undangan Rapat" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Undangan Rapat" }).click();

    // Navigate to all undangan rapat
    // await page
    //     .getByRole("link", { name: "Semua Undangan Rapat" })
    //     .waitFor({ state: "visible" });
    await page.getByRole("link", { name: "Semua Undangan Rapat" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "22-manager-undangan-final-list.png"),
    });

    // Search for the corrected undangan
    await page
        .getByRole("textbox", { name: "Cari Surat" })
        .waitFor({ state: "visible" });
    await page.getByRole("textbox", { name: "Cari Surat" }).fill("unda");

    // Approve the corrected undangan
    await page.locator(".bg-green-500 > button").waitFor({ state: "visible" });
    await page.locator(".bg-green-500 > button").click();
    await page.screenshot({
        path: path.join(testResultsDir, "23-approve-undangan-modal.png"),
    });

    await page
        .getByRole("button", { name: "Kirim Undangan Rapat ke" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Kirim Undangan Rapat ke" }).click();
    await page.waitForLoadState("networkidle");

    // Final approval step
    await page.locator(".bg-green-500").waitFor({ state: "visible" });
    await page.locator(".bg-green-500").click();
    await page
        .getByRole("button", { name: "Kirim Undangan Rapat ke" })
        .waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Kirim Undangan Rapat ke" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
        path: path.join(testResultsDir, "24-undangan-final-approved.png"),
    });

    // Verify the workflow is complete
    await expect(page.getByText("DashboardMemoUndangan")).toBeVisible();
    await page.screenshot({
        path: path.join(testResultsDir, "25-workflow-completed.png"),
    });
});
