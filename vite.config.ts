import { basename } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Preloads the two above-the-fold woff2 fonts (body sans + display serif) so
 * first paint starts fetching them before the CSS chunk arrives. Asset names
 * carry a build hash, so the tags are built from the emitted bundle.
 */
function fontPreload(): Plugin {
  const critical = [
    'plus-jakarta-sans-normal-200-800-latin',
    'instrument-serif-normal-400-latin',
  ];
  let base = './';
  return {
    name: 'font-preload',
    apply: 'build',
    configResolved(cfg) {
      base = cfg.base.endsWith('/') ? cfg.base : `${cfg.base}/`;
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const tags = Object.keys(ctx.bundle)
          .filter(
            (name) =>
              name.endsWith('.woff2') &&
              critical.some((c) => basename(name).startsWith(`${c}-`))
          )
          .map((name) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `${base}${name}`,
              crossorigin: '',
            },
            injectTo: 'head-prepend' as const,
          }));
        return { html, tags };
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), fontPreload()],
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
