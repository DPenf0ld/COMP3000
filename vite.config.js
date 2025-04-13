import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // This ensures that Vitest works well with ES Modules
    globals: true,
    environment: 'node',  // or 'jsdom' if you need a browser environment
  },
});
