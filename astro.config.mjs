import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://leohchen.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
