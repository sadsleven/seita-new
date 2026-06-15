import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Single `@` alias → src. `@/lib`, `@/components`, `@/modules/...` all resolve
// through it (matches the import-alias convention in PROMPT_React_MUI.md).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { port: 5173, open: true },
});
