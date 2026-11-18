import { defineConfig } from 'astro/config';

// TODO: غيّر site للدومين النهائي بعد النشر على Vercel
export default defineConfig({
  site: 'https://albakree.vercel.app',
  build: { format: 'directory', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
