// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: false // show VS Code when running
  }
});