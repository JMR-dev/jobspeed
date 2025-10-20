import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildUploadPage() {
  try {
    await build({
      root: path.resolve(__dirname, '../src'),
      build: {
        outDir: path.resolve(__dirname, '../dist'),
        emptyOutDir: false, // Don't empty the dir - other files are already there
        rollupOptions: {
          input: {
            upload: path.resolve(__dirname, '../src/upload.html'),
          },
          output: {
            entryFileNames: '[name].js',
            chunkFileNames: '[name]-[hash].js',
            assetFileNames: '[name].[ext]',
          },
        },
      },
      plugins: [react()],
    });
    console.log('✓ Upload page built successfully');
  } catch (error) {
    console.error('✗ Error building upload page:', error);
    process.exit(1);
  }
}

buildUploadPage();
