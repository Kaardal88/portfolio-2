// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Replace with your real domain once the site is deployed (used for canonical URLs and Open Graph).
  site: 'https://example.com',
  vite: {
    server: {
      // The file watcher missed saves on this machine, so the dev server kept serving
      // old content and styles. Polling checks the files on a timer instead.
      watch: { usePolling: true, interval: 300 },
    },
  },
});
