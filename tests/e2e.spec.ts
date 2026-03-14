import { test, expect } from '@playwright/test';

test.describe('Tesla Prime AI E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    await page.goto('/');
    // Wait for the initial app loader to disappear (it takes ~2 seconds)
    await expect(page.getByRole('button', { name: 'Open Account' }).first()).toBeVisible({ timeout: 15000 });
  });

  test('Landing Page Flow', async ({ page }) => {
    // Check Real Estate Section
    await expect(page.locator('h2:has-text("Real Estate Participation")').first()).toBeVisible();
    
    // Check Reseller Section
    await expect(page.locator('h2:has-text("Global Reseller Program")').first()).toBeVisible();
    
    // Check Fees Section
    await expect(page.locator('h2:has-text("Transparent Fees Built into Every Action")').first()).toBeVisible();
  });

  test('Navigation Flow', async ({ page }) => {
    // Click Features in the navigation
    await page.getByRole('button', { name: 'Features' }).first().click();
    await expect(page).toHaveURL(/.*features/);
    
    // Click Fees
    await page.getByRole('button', { name: 'Fees' }).first().click();
    await expect(page).toHaveURL(/.*fees/);
  });

  test('Authentication and Dashboard Flow', async ({ page }) => {
    // Click Open Account
    await page.getByRole('button', { name: 'Open Account' }).first().click();
    
    // Wait for modal
    await expect(page.locator('text=PRIME SSO')).toBeVisible();
    
    // Fill email
    await page.fill('input[type="email"]', 'alex.vance@prime.net');
    await page.fill('input[type="password"]', 'password123');
    
    // Click Login button
    await page.getByRole('button', { name: /Initialize Secure Handshake/i }).click();
    
    // Wait for redirect to dashboard (auth takes ~3.5 seconds total with timeouts)
    await expect(page.locator('text=Terminal').first()).toBeVisible({ timeout: 15000 });
    
    // Check dashboard elements
    await expect(page.locator('text=Net Liquidity')).toBeVisible();
  });
});
