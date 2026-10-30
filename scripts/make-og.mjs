// Erzeugt public/og-default.jpg (1200x630) aus dem Peking-Aufmacherfoto.
// Aufruf: node scripts/make-og.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'src/assets/peking/hero-jingshan.jpg';
const OUT = 'public/og-default.jpg';
const W = 1200;
const H = 630;

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.10"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="64" y="500" font-family="Georgia, 'Times New Roman', serif"
        font-size="64" fill="#ffffff" letter-spacing="-0.5">China Wegweiser</text>
  <text x="64" y="552" font-family="'Segoe UI', Arial, sans-serif"
        font-size="30" fill="#f2ede3">Peking, Shanghai, Xi'an – was wirklich zählt</text>
  <rect x="64" y="576" width="120" height="4" fill="#b23a2e"/>
</svg>`);

await mkdir('public', { recursive: true });
await sharp(SRC)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`OK ${OUT} ${meta.width}x${meta.height} ${(await sharp(OUT).stats()).isOpaque ? 'opaque' : 'transparent'}`);
