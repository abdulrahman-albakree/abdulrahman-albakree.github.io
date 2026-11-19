import { defineConfig } from 'astro/config';

// الرابط الأساسي: GitHub Pages (يفتح في اليمن). نسخة احتياط على albakree.pages.dev
export default defineConfig({
  site: 'https://abdulrahman-albakree.github.io',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
