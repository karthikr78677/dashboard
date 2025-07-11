import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  /**
   * ──────────────────────────────────────────────────────────────
   * Local‑dev server proxy
   * • Front‑end (Vite) runs on :5173
   * • Back‑end (Express/Mongo) runs on :3001
   * The proxy forwards /api/* and /uploads/* so you
   * don’t get CORS errors while coding locally.
   * ──────────────────────────────────────────────────────────────
   */
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  /**
   * Optional: expose only the env vars you need.
   * Anything prefixed with VITE_ will be statically
   * injected into your frontend build.
   */
  envPrefix: ['VITE_'],

  // Build settings (defaults are fine; tweak if you need)
  // build: {
  //   outDir: 'dist',
  //   sourcemap: false,
  // },
});
