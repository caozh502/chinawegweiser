#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [city, slug, title] = process.argv.slice(2);

if (!city || !slug || !title) {
  console.error('Aufruf:  npm run new -- <city> <slug> "<Titel>"');
  console.error('Beispiel: npm run new -- peking "grosse-mauer-tickets" "Große Mauer: Tickets für Ausländer"');
  process.exit(1);
}

const dir = join('src', 'content', 'guides', city);
mkdirSync(dir, { recursive: true });

const file = join(dir, `${slug}.md`);
if (existsSync(file)) {
  console.error('Datei existiert bereits:', file);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const tpl = `---
title: '${title}'
description: ''
answer: ''
city: ${city}
category: ''
status: draft
verified: '${today}'
sources: []
affiliate: []
faq: []
order: 100
---

> **Hinweis:** Entwurf – vor Veröffentlichung prüfen und Prüfdatum aktualisieren.

## Kurz

## Schritt für Schritt

## Was es kostet

## Die häufigsten Fehler
`;

writeFileSync(file, tpl, 'utf8');
console.log('erstellt:', file);
console.log('danach:  npm run dev  →  http://localhost:4321/' + city + '/' + slug + '/');
