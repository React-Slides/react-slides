/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Dev only: tells the app when a markdown file changes, so a deck opened with ?deck=<file>.md
// refreshes on save without a full page reload. The event name matches src/utils/deckFile.ts.
const deckFileReload = (): Plugin => ({
  name: 'react-slides-deck-file-reload',
  apply: 'serve',
  configureServer(server) {
    server.watcher.on('change', (changedPath) => {
      if (!changedPath.endsWith('.md')) return;
      const file = path.relative(server.config.root, changedPath).split(path.sep).join('/');
      if (file.startsWith('..')) return;
      server.ws.send({ type: 'custom', event: 'react-slides:deck-file-changed', data: { file } });
    });
  },
});

export default defineConfig({
  plugins: [react(), deckFileReload()],
  root: path.resolve(__dirname, ''),
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  }
});