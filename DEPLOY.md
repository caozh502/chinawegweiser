# Livegang: China Wegweiser

Statische Seite (Astro) → Cloudflare Pages. Kosten: 0 € Hosting, Domain ~5 €/Jahr.

## 0. Vor dem Deploy: drei Pflichtangaben

`src/data/site.ts` ausfüllen — sonst bricht `npm run check:legal` den Deploy ab:

```ts
owner: {
  name: 'Vorname Nachname',        // § 5 DDG, Pflicht
  street: 'Straße Hausnummer',     // Pflicht
  zipCity: '80331 München',        // Pflicht
  country: 'Deutschland',
  email: 'kontakt@chinawegweiser.de', // Pflicht
  phone: '',                       // optional
}
```

Warum das blockiert: In Deutschland ist ein Impressum mit Platzhaltern ein Abmahngrund.
Das Skript prüft das gebaute HTML und verweigert den Upload, solange `[...]` oder
`korrektur@example.com` darin stehen.

## 1. Domain

- Prüfen/registrieren bei INWX (ca. 4,65 €/Jahr, keine Upsells) oder Netcup.
- Danach in `src/data/site.ts` **und** `astro.config.mjs` (`site:`) eintragen — beide Stellen.
- Optional: `kontakt@` als E-Mail-Weiterleitung einrichten (bei INWX inklusive).

## 2. Cloudflare Pages (Direkt-Upload)

```bash
npx wrangler login                      # einmalig, Browser-Fenster bestätigen
npm run build && npm run check:legal    # oder: npm run deploy
npx wrangler pages deploy dist --project-name=chinawegweiser
```

Ergebnis: `https://chinawegweiser.pages.dev`. Diese Adresse ist **öffentlich** – erst
veröffentlichen, wenn Impressum stimmt.

### Staging ohne Risiko

Wenn erst gesichtet werden soll: in `astro.config.mjs` bleibt die Domain stehen, aber die
Seite bekommt vorübergehend `noindex`. Dafür in `src/layouts/Base.astro` im `<head>`
ergänzen:

```html
<meta name="robots" content="noindex, nofollow" />
```

Nach dem Freigeben wieder entfernen und neu deployen.

## 3. Eigene Domain verbinden

Cloudflare Dashboard → Workers & Pages → `chinawegweiser` → Custom domains →
`chinawegweiser.de` hinzufügen. Bei INWX die NS auf Cloudflare zeigen lassen (oder nur
CNAME `www`), Zertifikat kommt automatisch.

## 4. Danach (in dieser Reihenfolge)

1. **Cloudflare Web Analytics** aktivieren (cookiefrei) und Token in `src/data/site.ts`
   eintragen → `analyticsToken`. Kein Google Analytics, sonst Cookie-Banner nötig.
2. **Search Console + Bing** verifizieren, `https://chinawegweiser.de/sitemap-index.xml`
   einreichen.
3. **Affiliate-Programme** (erst wenn Traffic da ist): Klook → GetYourGuide → Awin
   (Allianz/HanseMerkur) → Airalo. IDs in `src/data/affiliates.ts` einsetzen.
4. **Git-Repo** (falls noch nicht geschehen) mit Cloudflare verbinden → Deploy bei jedem
   Push statt manuellem Upload.

## 5. Wiederkehrender Ablauf

```bash
npm run build          # baut dist/
npm run check:legal    # bricht ab, wenn Pflichtangaben fehlen
npm run preview        # lokal prüfen: http://127.0.0.1:4321
```

Deploy: `npm run deploy` (baut, prüft, lädt hoch).
