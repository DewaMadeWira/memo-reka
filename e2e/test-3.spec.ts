import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('mhr@gmail.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('password123');
  await page.getByRole('textbox', { name: 'Password' }).press('Ente
  await page.getByRole('button', { name: '+ Tambah Divisi' }).click();
  await page.getByRole('textbox', { name: 'Nama Divisi' }).click();
  await page.getByRole('textbox', { name: 'Nama Divisi' }).fill('new division');
  await page.getByRole('button', { name: 'Simpan' }).click();
  await page.getByRole('button', { name: 'Simpan' }).click();r');
  await page.getByRole('button', { name: 'Log in' }).click();
});