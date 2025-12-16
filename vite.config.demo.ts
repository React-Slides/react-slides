import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Demo build configuration for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/react-slides/', // GitHub Pages base path
  root: path.resolve(__dirname, ''),
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
    },
  },
});
