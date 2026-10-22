import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pagesおよびローカルファイルプレビューに対応
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('firebase')) return 'vendor-firebase';
          if (id.includes('react')) return 'vendor-react';
          if (id.includes('lucide')) return 'vendor-icons';
          if (id.includes('canvas-confetti')) return 'vendor-confetti';
          return 'vendor';
        },
      },
    },
  },
});
