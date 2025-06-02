import { test, expect } from "@playwright/test";
import * as fs from 'fs';
import * as path from 'path';

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

// Define base screenshots directory
const baseScreenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');

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
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(dir, `${screenshotName}_${timestamp}.png`);
    await page.screenshot({ path: filePath });
    return filePath;
};

test.describe("User Authentication", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to login page before each test
        await page.goto("http://127.0.0.1:8000/login");
    });

    test("HR Manager can login and access manager features", async ({
        page,
    }) => {
        const testGroup = 'auth';
        const testName = 'hr-manager-login';
        
        // Take screenshot of login page
        await takeScreenshot(page, testGroup, testName, 'login-page');
        
        // Login as HR Manager
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.managerHr.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.managerHr.password);
        
        // Take screenshot before clicking login
        await takeScreenshot(page, testGroup, testName, 'form-filled');
        
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");
        
        // Take screenshot of HR Manager dashboard
        await takeScreenshot(page, testGroup, testName, 'dashboard');

        // Verify HR division-specific elements
        // await expect(page.getByText("You're logged in!")).toBeVisible();

        // Verify manager role-specific elements (approval buttons, management options)
        // await expect(page.getByText(/Approval/i)).toBeVisible();
    });

    test("HR Employee can login and access employee features", async ({
        page,
    }) => {
        const testGroup = 'auth';
        const testName = 'hr-employee-login';
        
        // Take screenshot of login page
        await takeScreenshot(page, testGroup, testName, 'login-page');
        
        // Login as HR Employee
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.employeeHr.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.employeeHr.password);
        
        // Take screenshot before clicking login
        await takeScreenshot(page, testGroup, testName, 'form-filled');
        
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");
        
        // Take screenshot of HR Employee dashboard
        await takeScreenshot(page, testGroup, testName, 'dashboard');

        // Verify HR division-specific elements
        // await expect(page.getByText("You're logged in!")).toBeVisible();

        // Verify employee role-specific elements (document creation, but no approval)
        // await expect(page.getByText(/Create Memo/i)).toBeVisible();
        // await expect(page.getByText(/Approval/i)).not.toBeVisible();
    });

    test("Logistics Manager can login and access manager features", async ({
        page,
    }) => {
        const testGroup = 'auth';
        const testName = 'logistics-manager-login';
        
        // Take screenshot of login page
        await takeScreenshot(page, testGroup, testName, 'login-page');
        
        // Login as Logistics Manager
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.managerLog.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.managerLog.password);
        
        // Take screenshot before clicking login
        await takeScreenshot(page, testGroup, testName, 'form-filled');
        
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");
        
        // Take screenshot of Logistics Manager dashboard
        await takeScreenshot(page, testGroup, testName, 'dashboard');

        // Verify Logistics division-specific elements
        // await expect(page.getByText("You're logged in!")).toBeVisible();
        // await expect(page.getByText(/Logistics/i)).toBeVisible();

        // Verify manager role-specific elements (approval buttons, management options)
        // await expect(page.getByText(/Approval/i)).toBeVisible();
    });

    test("Logistics Employee can login and access employee features", async ({
        page,
    }) => {
        const testGroup = 'auth';
        const testName = 'logistics-employee-login';
        
        // Take screenshot of login page
        await takeScreenshot(page, testGroup, testName, 'login-page');
        
        // Login as Logistics Employee
        await page
            .getByRole("textbox", { name: "Email" })
            .fill(account.employeeLog.email);
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill(account.employeeLog.password);
        
        // Take screenshot before clicking login
        await takeScreenshot(page, testGroup, testName, 'form-filled');
        
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify successful login and redirect to dashboard
        await expect(page).toHaveURL("http://127.0.0.1:8000/dashboard");
        
        // Take screenshot of Logistics Employee dashboard
        await takeScreenshot(page, testGroup, testName, 'dashboard');

        // Verify Logistics division-specific elements
        // await expect(page.getByText("You're logged in!")).toBeVisible();
        // await expect(page.getByText(/Logistics/i)).toBeVisible();

        // Verify employee role-specific elements (document creation, but no approval)
        // await expect(page.getByText(/Create Memo/i)).toBeVisible();
        // await expect(page.getByText(/Approval/i)).not.toBeVisible();
    });

    test("Login with invalid credentials shows error", async ({ page }) => {
        const testGroup = 'auth';
        const testName = 'invalid-login';
        
        // Take screenshot of login page
        await takeScreenshot(page, testGroup, testName, 'login-page');
        
        await page
            .getByRole("textbox", { name: "Email" })
            .fill("wrong@example.com");
        await page.getByRole("textbox", { name: "Email" }).press("Tab");
        await page
            .getByRole("textbox", { name: "Password" })
            .fill("wrongpassword");
        
        // Take screenshot before clicking login with invalid credentials
        await takeScreenshot(page, testGroup, testName, 'form-filled');
        
        await page.getByRole("button", { name: "Log in" }).click();

        // Verify error message is displayed
        await expect(page.getByText(/credentials do not match/i)).toBeVisible();
        
        // Take screenshot showing error message
        await takeScreenshot(page, testGroup, testName, 'error-message');

        // Verify we're still on the login page
        await expect(page).toHaveURL("http://127.0.0.1:8000/login");
    });
});
