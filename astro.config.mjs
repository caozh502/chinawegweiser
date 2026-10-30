import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import headingIds from './src/lib/rehype-heading-ids.mjs';
import fs from 'node:fs';

/* Städteseiten ohne Inhalt (Platzhalter, noindex) gehören nicht in die Sitemap. */
const mitInhalt = new Set(
  fs.readdirSync('./src/content/cities').map((f) => f.replace(/\.md$/, ''))
);
const istPlatzhalter = (url) => {
  const m = url.match(/\/stadt\/([^/]+)\/$/);
  return Boolean(m && !mitInhalt.has(m[1]));
};

// Domain: chinawegweiser.de (Namensentscheid 2026-10-29)
export default defineConfig({
  site: 'https://chinawegweiser.de',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [headingIds] },
  integrations: [sitemap({ filter: (page) => !istPlatzhalter(page) })],
});
