import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base: works at a domain root (Netlify) and under a subpath
  // (GitHub Pages /Portfolio/) without rebuilding.
  base: './',
});
