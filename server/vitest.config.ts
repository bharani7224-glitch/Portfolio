import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 60000,
    hookTimeout: 300000, // 5 minutes to accommodate initial binary download
    fileParallelism: false, // Run sequentially so both suites share the downloaded binary
  },
});
