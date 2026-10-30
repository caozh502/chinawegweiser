// Optimiert die WeChat-QR-Codes: gleiche Dateien, aber als Palette-PNG.
// Ein QR-Code braucht keine 16 Mio. Farben – 32 reichen, das spart ~85 %.
//   node scripts/optimize-qr.mjs
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = 'src/assets';
const dirs = await readdir(root);
let before = 0;
let after = 0;

for (const d of dirs) {
  const dir = path.join(root, d);
  let files;
  try {
    files = await readdir(dir);
  } catch {
    continue;
  }
  for (const f of files.filter((n) => /^qr-.*\.png$/i.test(n))) {
    const p = path.join(dir, f);
    const oldSize = (await stat(p)).size;
    const buf = await sharp(p)
      .resize({ width: 420, height: 420, fit: 'inside', withoutEnlargement: true })
      .png({ palette: true, colours: 32, compressionLevel: 9, dither: 1 })
      .toBuffer();
    if (buf.length < oldSize) {
      await sharp(buf).toFile(p + '.tmp');
      await (await import('node:fs/promises')).rename(p + '.tmp', p);
      before += oldSize;
      after += buf.length;
      console.log(`${p}: ${(oldSize / 1024).toFixed(0)} KB → ${(buf.length / 1024).toFixed(0)} KB`);
    } else {
      console.log(`${p}: unverändert (${(oldSize / 1024).toFixed(0)} KB)`);
    }
  }
}
if (before) console.log(`\nGesamt: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB`);
