#!/usr/bin/env node
/**
 * Lädt genau benannte Dateien von Wikimedia Commons (statt „erster Treffer")
 * und schreibt Frontmatter-Blöcke mit Pflicht-Attribution.
 *
 *   node scripts/fetch-file.mjs system "didi-auto=File:BYD Qin Plus EV in DiDi Chuxing Service.jpg"
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const UA = 'ChinaPraxis/0.1 (static travel guide; contact: redaktion@example.com)';
const API = 'https://commons.wikimedia.org/w/api.php';
const [, , dirName, ...pairs] = process.argv;

if (!dirName || !pairs.length) {
  console.error('Aufruf: node scripts/fetch-file.mjs <ordner> "<slug>=<Dateititel>" [...]');
  process.exit(1);
}
const dir = join('src', 'assets', dirName);
mkdirSync(dir, { recursive: true });

const strip = (s) =>
  (s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

for (const pair of pairs) {
  const idx = pair.indexOf('=');
  const slug = pair.slice(0, idx);
  const title = pair.slice(idx + 1);
  const url =
    API +
    '?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata|user',
      iiurlwidth: '1600',
    });
  const j = await (await fetch(url, { headers: { 'User-Agent': UA } })).json();
  const page = Object.values(j?.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) {
    console.error(`✗ ${slug}: nicht gefunden (${title})`);
    continue;
  }
  const em = ii.extmetadata ?? {};
  const license = strip(em.LicenseShortName?.value);
  const author = strip(em.Artist?.value) || strip(ii.user);
  if (!/CC BY|CC0|Public domain/i.test(license)) {
    console.error(`✗ ${slug}: Lizenz nicht erlaubt (${license})`);
    continue;
  }
  const buf = Buffer.from(
    await (await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } })).arrayBuffer()
  );
  writeFileSync(join(dir, `${slug}.jpg`), buf);
  const pageUrl = `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  console.log(`✓ ${slug}.jpg  ${ii.width}×${ii.height}  ${license}  ${author}`);
  console.log(`  file: '${dirName}/${slug}.jpg'`);
  console.log(`  alt: '…'`);
  console.log(`  caption: '…'`);
  console.log(`  author: '${author.replace(/'/g, "''")}'`);
  console.log(`  license: '${license}'`);
  console.log(
    `  licenseUrl: '${strip(em.LicenseUrl?.value) || 'https://commons.wikimedia.org/wiki/Commons:Licensing'}'`
  );
  console.log(`  sourceUrl: '${pageUrl}'`);
  console.log('');
}
