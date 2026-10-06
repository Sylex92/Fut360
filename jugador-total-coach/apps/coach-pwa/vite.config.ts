import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error Build-only JavaScript plugin with no browser dependencies.
import { offlinePlugin } from '../../tools/offline-plugin.mjs';
// @ts-expect-error Build-only asset verification, no browser dependencies.
import { localMediaPlugin } from '../../tools/local-media-plugin.mjs';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), localMediaPlugin(), offlinePlugin()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: { target: 'es2022', sourcemap: true },
});
