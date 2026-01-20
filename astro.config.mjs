import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://leoblog.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
