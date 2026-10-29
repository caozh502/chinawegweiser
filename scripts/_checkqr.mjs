
import fs from 'node:fs';
import yaml from 'js-yaml';
const txt = fs.readFileSync('src/content/cities/peking.md','utf8');
const fm = txt.split('---')[1];
const d = yaml.load(fm);
console.log('sights:', d.sights.length);
for (const s of d.sights) console.log(s.no, s.name, '->', s.qr ?? '-', '| ticket:', s.ticketUrl ? 'ja' : 'nein');
