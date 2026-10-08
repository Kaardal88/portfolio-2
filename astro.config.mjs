// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // The live domain, used for canonical URLs, Open Graph and the sitemap.
  site: 'https://kaardal.netlify.app',

  vite: {
    server: {
      // The file watcher missed saves on this machine, so the dev server kept serving
      // old content and styles. Polling checks the files on a timer instead.
      watch: { usePolling: true, interval: 300 },
    },
  },

  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});