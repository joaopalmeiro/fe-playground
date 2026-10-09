import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    browser: {
      enabled: true,
      expect: {
        toMatchScreenshot: {
          comparatorName: "pixelmatch",
          comparatorOptions: {
            allowedMismatchedPixelRatio: 0,
          },
          resolveScreenshotPath: ({ arg, ext, browserName, platform, screenshotDirectory, root, testFileDirectory }) =>
            resolve(root, testFileDirectory, screenshotDirectory, `${arg}-${browserName}-${platform}${ext}`),
        },
      },
      headless: true,
      instances: [{ browser: "chromium", viewport: { height: 720, width: 1280 } }],
      provider: playwright(),
    },
    include: ["tests/**/*.test.tsx"],
    setupFiles: ["tests/setup.ts"],
  },
});
