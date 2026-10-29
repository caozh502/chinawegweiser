import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import headingIds from './src/lib/rehype-heading-ids.mjs';

// Domain: chinawegweiser.de (Namensentscheid 2026-10-29)
export default defineConfig({
  site: 'https://chinawegweiser.de',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [headingIds] },
  integrations: [sitemap()],
});
