import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'src',
  plugins: [
    react(),
    webExtension({
      manifest: 'manifest.json',
      watchFilePaths: ['**/*'],
      browser: 'firefox',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    copyPublicDir: true,
  },
  assetsInclude: ['**/*.sqlite', '**/*.wasm'],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
