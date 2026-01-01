import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
  assetsInclude: ['**/*.node'],
  worker: {
    format: 'es',
  },
  root: '.',
  server: {
    watch: {
      usePolling: false,
    },
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_BARE_IMPORT') {
          return;
        }
        warn(warning);
      },
    },
  },
});
