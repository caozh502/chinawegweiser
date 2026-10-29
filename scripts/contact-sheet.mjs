import sharp from 'sharp';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const W = 420, H = 300, COLS = 4;
const files = process.argv.slice(2);
const rows = Math.ceil(files.length / COLS);

const tiles = [];
for (let i = 0; i < files.length; i++) {
  const f = files[i];
  if (!existsSync(f)) continue;
  const x = (i % COLS) * W;
  const y = Math.floor(i / COLS) * H;
  const img = await sharp(f).resize(W, H, { fit: 'cover' }).toBuffer();
  const label = String(i + 1).padStart(2, '0') + '  ' + f.split('/').pop().replace(/\.jpg$/, '');
  const svg = Buffer.from(
    `<svg width="${W}" height="${H}"><rect x="0" y="${H - 30}" width="${W}" height="30" fill="rgba(0,0,0,.72)"/>` +
    `<text x="10" y="${H - 10}" font-family="DejaVu Sans, Arial" font-size="17" fill="#fff">${label}</text></svg>`
  );
  tiles.push({ input: img, left: x, top: y });
  tiles.push({ input: svg, left: x, top: y });
}

await sharp({ create: { width: W * COLS, height: H * rows, channels: 3, background: '#111' } })
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile('preview/contact-sheet.jpg');
console.log('preview/contact-sheet.jpg', `${files.length} Bilder`);
