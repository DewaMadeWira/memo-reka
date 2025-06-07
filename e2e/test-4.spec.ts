import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('phr@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Escape');
});