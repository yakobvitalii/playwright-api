import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'x-api-key': process.env.REQRES_API_KEY || '',
      'Content-Type': 'application/json',
    },
  },
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 1,
  fullyParallel: true,
  testDir: './src/tests',
  reporter: [['dot'], ['github']],
});