/**
 * Bricht den Deploy ab, solange Platzhalter im gebauten HTML stehen.
 * Aufruf: npm run check:legal  (nach dem Build)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'dist';
const MARKER = [/\[Vor- und Nachname\]/, /\[Straße und Hausnummer\]/, /\[PLZ Ort\]/, /\[E-Mail-Adresse\]/, /korrektur@example\.com/];

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  }
})(ROOT);

const hits = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const re of MARKER) {
    if (re.test(html)) hits.push(`${f}: ${re}`);
  }
}

if (hits.length) {
  console.error('\nNICHT DEPLOYEN — Pflichtangaben fehlen:');
  for (const h of [...new Set(hits)]) console.error('  ' + h);
  console.error('\nTrage Name, Anschrift und E-Mail in src/data/site.ts ein.\n');
  process.exit(1);
}
console.log('Legal-Check: ok (' + files.length + ' HTML-Dateien geprüft)');
