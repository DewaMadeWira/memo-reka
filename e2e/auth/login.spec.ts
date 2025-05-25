import { test, expect } from "@playwright/test";

export const account = {
    // super_admin: {
    //   email: 'admin@example.com',
    //   password: 'admin-password'
    // },
    managerHr: {
        email: "mhr@gmail.com",
        password: "password123",
    },
    employeeHr: {
        email: "phr@gmail.com",
        password: "password123",
    },
    managerLog: {
        email: "mlog@gmail.com",
        password: "password123",
    },
    employeeLog: {
        email: "plog@gmail.com",
        password: "password123",
    },
};

test.describe("User Authentication", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to login page before each test
        await page.goto("http://127.0.0.1:8000/login");
    });

    test("HR Manager can login and access manager features", async ({
        page,
    }) => {
        // Login as HR Manager
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.managerHr.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.managerHr.password);
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");

        // Verify HR division-specific elements
        await expect(page.getByText("You're logged in!")).toBeVisible();

        // Verify manager role-specific elements (approval buttons, management options)
        // await expect(page.getByText(/Approval/i)).toBeVisible();
    });

    test("HR Employee can login and access employee features", async ({
        page,
    }) => {
        // Login as HR Employee
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.employeeHr.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.employeeHr.password);
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");

        // Verify HR division-specific elements
        await expect(page.getByText("You're logged in!")).toBeVisible();

        // Verify employee role-specific elements (document creation, but no approval)
        // await expect(page.getByText(/Create Memo/i)).toBeVisible();
        // await expect(page.getByText(/Approval/i)).not.toBeVisible();
    });

    test("Logistics Manager can login and access manager features", async ({
        page,
    }) => {
        // Login as Logistics Manager
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.managerLog.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.managerLog.password);
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");

        // Verify Logistics division-specific elements

        await expect(page.getByText("You're logged in!")).toBeVisible();
        // await expect(page.getByText(/Logistics/i)).toBeVisible();

        // Verify manager role-specific elements (approval buttons, management options)
        // await expect(page.getByText(/Approval/i)).toBeVisible();
    });

    test("Logistics Employee can login and access employee features", async ({
        page,
    }) => {
        // Login as Logistics Employee
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.employeeLog.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.employeeLog.password);
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");

        // Verify Logistics division-specific elements
        await expect(page.getByText("You're logged in!")).toBeVisible();
        // await expect(page.getByText(/Logistics/i)).toBeVisible();

        // Verify employee role-specific elements (document creation, but no approval)
        // await expect(page.getByText(/Create Memo/i)).toBeVisible();
        // await expect(page.getByText(/Approval/i)).not.toBeVisible();
    });

    test("Login with invalid credentials shows error", async ({ page }) => {
        await page
            .getByRole("textbox", { name: "Email" })
            .fill("wrong@example.com");
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill("wrongpassword");
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify error message is displayed
        await expect(page.getByText(/credentials do not match/i)).toBeVisible();

        // Verify we're still on the login page
        await expect(page).toHaveURL("http://127.0.0.1:8000/login");
    });
});
