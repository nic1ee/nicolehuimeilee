import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base: the same build works on GitHub Pages (user or project site) and in previews.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', cssCodeSplit: false },
});
