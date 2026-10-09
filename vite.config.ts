import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base: works at a domain root (Netlify) and under a subpath
  // (GitHub Pages /Portfolio/) without rebuilding.
  base: './',
  build: {
    // Split heavy third-party code out of the entry chunk so first paint
    // parses less JS and repeat visits reuse cached vendor chunks.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy third-party code out of the entry chunk so first
        // paint parses less JS and repeat visits reuse cached vendor chunks.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('/gsap/') || id.includes('/lenis/')) return 'anim';
          if (id.includes('lucide-react')) return 'icons';
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          return undefined;
        },
      },
    },
  },
});
