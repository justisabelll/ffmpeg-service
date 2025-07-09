import { defineConfig } from 'vite';
import hono from '@hono/vite-dev-server';
import tailwindcss from './node_modules/@tailwindcss/vite/dist/index.mjs';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(),
    hono({
      entry: 'src/index.tsx',
    }),
  ],
});
