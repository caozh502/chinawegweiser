import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import headingIds from './src/lib/rehype-heading-ids.mjs';

import fs from 'node:fs';
import path from 'node:path';

/* Städteseiten ohne Inhalt (Platzhalter, noindex) gehören nicht in die Sitemap. */
const mitInhalt = new Set(
  fs.readdirSync('./src/content/cities').map((f) => f.replace(/\.md$/, ''))
);
const istPlatzhalter = (url) => {
  const m = url.match(/\/stadt\/([^/]+)\/$/);
  return Boolean(m && !mitInhalt.has(m[1]));
};

/* lastmod je URL aus dem Feld `verified` der Inhalte. Google nutzt lastmod,
   um zu entscheiden, ob eine Seite neu geholt werden muss – ohne Angabe wird
   bei so kleinen Seiten oft wochenlang nicht neu gecrawlt. */
function verifiedMap() {
  const map = new Map();
  const files = [
    ...fs.readdirSync('./src/content/cities').map((f) => ({
      p: path.join('./src/content/cities', f),
      url: `/stadt/${f.replace(/\.md$/, '')}/`,
    })),
    ...fs.readdirSync('./src/content/guides/system').map((f) => ({
      p: path.join('./src/content/guides/system', f),
      url: `/system/${f.replace(/\.md$/, '')}/`,
    })),
  ];
  for (const { p, url } of files) {
    if (!p.endsWith('.md')) continue;
    const head = fs.readFileSync(p, 'utf8').split('---')[1] ?? '';
    const m = head.match(/^verified:\s*'?(\d{4}-\d{2}-\d{2})'?/m);
    if (m) map.set(url, m[1]);
  }
  return map;
}
const LASTMOD = verifiedMap();

// Domain: chinawegweiser.de (Namensentscheid 2026-10-29)
export default defineConfig({
  site: 'https://chinawegweiser.de',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [headingIds] },
  integrations: [
    sitemap({
      filter: (page) => !istPlatzhalter(page),
      serialize(item) {
        const p = new URL(item.url).pathname;
        // Inhalte: Datum der letzten Prüfung. Statische Seiten: Build-Datum.
        item.lastmod = LASTMOD.get(p) ?? new Date().toISOString().slice(0, 10);
        return item;
      },
    }),
  ],
});
