import { defineConfig } from 'astro/config';

// الرابط الحالي على Cloudflare Pages — غيّره لو ربطت دومين خاص
export default defineConfig({
  site: 'https://albakree.pages.dev',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
