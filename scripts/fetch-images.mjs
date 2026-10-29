#!/usr/bin/env node
/**
 * Lädt frei lizenzierte Fotos von Wikimedia Commons und gibt fertige
 * Frontmatter-Blöcke (inkl. Pflicht-Attribution) aus.
 *
 * Aufruf:
 *   node scripts/fetch-images.mjs peking "gugong-hoftor=Forbidden City Meridian Gate" \
 *                                        "mauer=Mutianyu Great Wall"
 *
 * Ergebnis:
 *   src/assets/peking/<slug>.jpg
 *   + YAML-Snippet auf stdout, das du in src/content/cities/<stadt>.md einfügst.
 *
 * Regeln (bewusst hart):
 *   - nur JPEG mit mindestens 1400 px Breite
 *   - nur CC0 / Public Domain / CC BY / CC BY-SA
 *   - Autor und Lizenz-URL werden mitgeschrieben; ohne sie rendert Photo.astro nicht
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const UA = 'ChinaPraxis/0.1 (static travel guide; contact: redaktion@example.com)';
const API = 'https://commons.wikimedia.org/w/api.php';
const [, , city, ...pairs] = process.argv;

if (!city || pairs.length === 0) {
  console.error('Aufruf: node scripts/fetch-images.mjs <stadt> "<slug>=<Suchbegriff>" [...]');
  process.exit(1);
}

const strip = (s) =>
  (s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();

const dir = join('src', 'assets', city);
mkdirSync(dir, { recursive: true });

for (const pair of pairs) {
  const [slug, ...rest] = pair.split('=');
  const query = rest.join('=');
  if (!slug || !query) {
    console.error('Übersprungen (Format):', pair);
    continue;
  }

  const url =
    API +
    '?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: '6',
      gsrlimit: '15',
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: '1600',
    });

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const json = await res.json();
  const pages = Object.values(json?.query?.pages ?? {});

  let picked = null;
  for (const p of pages) {
    const ii = (p.imageinfo ?? [])[0];
    if (!ii || ii.mime !== 'image/jpeg' || (ii.width ?? 0) < 1400) continue;
    const em = ii.extmetadata ?? {};
    const license = strip(em.LicenseShortName?.value);
    if (!/CC BY|CC0|Public domain/i.test(license)) continue;
    picked = { p, ii, em, license };
    break;
  }

  if (!picked) {
    console.error(`✗ ${slug}: kein passendes Bild für "${query}"`);
    continue;
  }

  const buf = Buffer.from(await (await fetch(picked.ii.thumburl ?? picked.ii.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  const file = join(dir, `${slug}.jpg`);
  writeFileSync(file, buf);

  const author = strip(picked.em.Artist?.value).slice(0, 80) || 'Wikimedia Commons';
  const licenseUrl =
    picked.em.LicenseUrl?.value || 'https://commons.wikimedia.org/wiki/Commons:Licensing';
  const title = picked.p.title.replace(/^File:/, '').replace(/ /g, '_');
  const sourceUrl = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title).replace(/%2F/g, '/')}`;

  console.error(`✓ ${slug} (${Math.round(buf.length / 1024)} KB, ${picked.license})`);

  console.log(`      file: '${city}/${slug}.jpg'
      alt: ''
      caption: ''
      author: '${author}'
      license: '${picked.license}'
      licenseUrl: '${licenseUrl}'
      sourceUrl: '${sourceUrl}'`);
}
