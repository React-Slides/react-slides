import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Library build configuration for npm publishing
// ESM-only since remark/rehype plugins don't have UMD globals
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    cssCodeSplit: false, // Bundle all CSS into one file
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReactSlides',
      fileName: 'react-slides',
      formats: ['es'], // ESM-only (remark/rehype are ESM-only packages)
    },
    rollupOptions: {
      // Externalize all dependencies - consumers install what they need
      external: [
        // React core
        'react',
        'react-dom',
        'react/jsx-runtime',

        // Charts & Visualization
        'recharts',

        // Markdown processing
        'react-markdown',
        'remark-gfm',
        'remark-math',
        'rehype-katex',

        // Math rendering
        'katex',

        // Export utilities (optional)
        'html2canvas',
        'jspdf',
        'pptxgenjs',

        // Icons
        'lucide-react',

        // Utilities
        'js-yaml',
      ],
    },
    outDir: 'dist',
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
    },
  },
});
