# China Wegweiser — deutscher China-Reiseführer (statische Seite)

Nachbau des oumengke.com-Modells für den **deutschen** Markt: eine Seite pro Suchintent,
Kategorie → Stadt → Seite, Prüfdatum auf jeder Seite, Monetarisierung über Affiliate-Slots.

Stack: Astro 5 (statisch), Markdown-Inhalte, keine Datenbank, kein Backend, kein Tracking.
Deployziel: Cloudflare Pages (kostenlos, unbegrenzte Bandbreite).

---

## 1. Lokal starten

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # erzeugt dist/
npm run preview    # gebaute Seite lokal ansehen
```

## 2. Struktur

```
src/
  content.config.ts        Schema für alle Seiten (Pflichtfelder!)
  content/guides/          Inhalte: ein Ordner pro Stadt, eine Datei pro Seite
    system/                stadtunabhängig: Einreise, Internet, Bezahlen …
    peking/ shanghai/ …
  layouts/
    Base.astro             <head>, Header, Footer, Meta
    Guide.astro            DAS Seiten-Template: Fazit-Box, Badges, CN-Karte, Affiliate, FAQ
  components/AffiliateBox.astro
  data/affiliates.ts       ← alle Partner-Links hier eintragen
  pages/
    index.astro            Startseite, gruppiert nach Stadt
    [...slug].astro        erzeugt /system/internet-esim/ usw.
    stadt/[city].astro     Stadt-Hubs /stadt/peking/
    praktisch/index.astro  Übersicht der Grundlagen-Seiten
    impressum, datenschutz, transparenz
```

Routen entstehen aus dem Dateipfad: `src/content/guides/peking/verbotene-stadt-tickets.md`
→ `/peking/verbotene-stadt-tickets/`.

## 3. Neue Seite anlegen

```bash
npm run new -- peking "grosse-mauer-tickets" "Große Mauer: Tickets für Ausländer"
```

Dann die Datei füllen. Frontmatter-Felder:

| Feld | Pflicht | Bedeutung |
| --- | --- | --- |
| `title` | ja | H1 und `<title>` |
| `description` | ja | Meta-Description, 150–160 Zeichen |
| `answer` | ja | „Fazit zuerst", 2–4 Sätze. Erscheint in der farbigen Box |
| `city` | ja | Ordnername (`system`, `peking`, …) |
| `category` | ja | z. B. `tickets`, `transport`, `sehenswuerdigkeit` |
| `status` | ja | `verified` / `draft` / `stale` — steuert das Badge |
| `verified` | empfohlen | `YYYY-MM-DD`, Datum der letzten Prüfung |
| `sources` | ja | Liste `{label, url}` — offizielle Quellen |
| `chinese` | optional | `{name, address, note}` → große chinesische Karte zum Vorzeigen |
| `affiliate` | nein | Slots aus `src/data/affiliates.ts`, z. B. `['esim','hotels']` |
| `faq` | optional | `[{q, a}]` → rendert FAQ + FAQPage-JSON-LD |
| `order` | nein | Sortierung innerhalb der Stadt (klein = oben) |

### Statusregel (nicht verhandelbar)

- `verified` nur, wenn du die Angabe an einer offiziellen Quelle **oder vor Ort** kontrolliert hast.
- `draft` = recherchiert, ungeprüft. Steht sichtbar auf der Seite. Das ist kein Makel, das ist der
  Vertrauensmechanismus.
- `stale` = älter als ~6 Monate. Setzt du per Hand, wenn du eine Seite nicht nachziehst.

## 4. Vor dem Livegang ersetzen

- [ ] `astro.config.mjs` → `site:` auf die echte Domain
- [ ] `public/robots.txt` → Sitemap-URL
- [ ] `src/pages/impressum.astro` → Name, Anschrift, E-Mail (Pflicht nach § 5 DDG)
- [ ] `src/pages/datenschutz.astro` → Verantwortlicher eintragen
- [ ] `src/layouts/Guide.astro` → `mailto:korrektur@example.com` ersetzen
- [ ] `src/data/affiliates.ts` → echte Tracking-Links (aktuell Platzhalter auf die Normal-URLs)
- [ ] `src/pages/transparenz.astro` → Partnerliste an die echten Programme anpassen

## 5. Deploy auf Cloudflare Pages

**Variante A — Git (empfohlen, dann automatisch bei jedem Push):**

1. Repo zu GitHub pushen.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Framework-Preset: **Astro** · Build command: `npm run build` · Output: `dist`
4. Deploy. Fertig.

**Variante B — CLI, ohne Git:**

```bash
npm run build
npx wrangler pages deploy dist --project-name=chinawegweiser
```

Beim ersten Mal öffnet Wrangler den Browser für den Cloudflare-Login.

**Domain:** Cloudflare Pages → Custom domains → Domain hinzufügen, dann beim Registrar die
Nameserver auf Cloudflare zeigen lassen. `.de` gibt es bei INWX ab ca. 4,65 €/Jahr; DENIC verlangt
einen Ansprechpartner mit deutscher Anschrift.

## 6. Kosten

| Posten | Preis |
| --- | --- |
| Hosting (Cloudflare Pages Free) | 0 € — unbegrenzte Requests, 500 Builds/Monat |
| TLS, Analytics, Kommentare | 0 € |
| Domain | 5–15 €/Jahr |
| **Summe Jahr 1** | **5–15 €** |

Nicht auf Vercel Hobby deployen: dessen AGB erlauben nur nicht-kommerzielle Nutzung.

## 7. Nächste Schritte (Inhalt)

Reihenfolge nach erwartetem Suchvolumen × Kaufabsicht:

1. `system/visumfrei-china-30-tage` ✅
2. `system/internet-esim` ✅
3. `system/bezahlen` (Alipay/WeChat mit deutscher Karte)
4. `peking/verbotene-stadt-tickets` ✅ (Entwurf)
5. `peking/grosse-mauer-tickets` (Abschnitte: Mutianyu, Jinshanling, Jiankou)
6. `system/zug-tickets-12306` · `system/u-bahn-metro`
7. `system/reiseversicherung` (höchste Provision pro Abschluss)
8. danach: Shanghai, Xi'an, Chengdu

---

## 8. Städte-Seiten — der dicke Aufbau

Das ist das Herzstück (Vorbild: oumengke.com, „Barcelona"). Eine Datei in
`src/content/cities/` erzeugt `/stadt/<stadt>/` mit sieben Blöcken:

| Block | Quelle im Frontmatter |
| --- | --- |
| Hero-Foto + Attribution | `hero` |
| Steckbrief (4 Kacheln) | `days`, `season`, `budget`, `base` |
| Fließtext | Markdown-Body (Anreise, Fortbewegung, Fallen) |
| Anreise-Tabelle | `connections` |
| Wo wohnen (Bereiche + Hotels) | `areas` |
| Sehenswürdigkeiten ❶–❿ + Karte | `sights` |
| Routen (1/3/5 Tage) | `plans` |
| Vorher buchen / Typische Fehler | `bookAhead`, `traps` |
| Detailseiten | automatisch aus `guides` derselben Stadt |

**Der Trick:** `plans` referenziert nur Nummern aus `sights`
(`sights: [1, 5, 6]`). Die Routen-Karten rendern daraus klickbare Chips, die
auf die Anker `#s1`, `#s5` … springen. Kein zweites Datenmodell, keine doppelte
Pflege.

Karte: `SightMap.astro` liest `lat`/`lng` aus `sights` und lädt Leaflet erst,
wenn der Block in Sichtweite kommt (IntersectionObserver + Scroll/Timeout-Fallback).
Ohne Koordinaten wird keine Karte gerendert.

Bedienung: Klick auf Legende oder „auf Karte" zoomt auf den Punkt (`setView`, z15).
Zwei Ansichten: **Stadtzentrum** (blendet Ziele > 20 km aus) und **Alle**.
Kacheln kommen aus `src/data/map.ts` – dort auf MapTiler wechseln, sobald die Seite
Traffic bekommt (OSM-Rohkacheln sind nur für leichte Nutzung gedacht).


## 9. Bilder: Regeln und Werkzeug

**Nur drei Quellen sind erlaubt:**

1. eigene Fotos
2. **Wikimedia Commons** — CC0, Public Domain, CC BY, CC BY-SA (Namensnennung Pflicht)
3. Unsplash (keine Namensnennung nötig, Quelle trotzdem notieren)

Ausgeschlossen: Google Bildersuche, Instagram, Xiaohongshu, Hersteller-Presseseiten
ohne ausdrückliche Freigabe. Bilderklau ist in Deutschland ein eigener
Abmahnmarkt (800–1.500 € pro Fall) — die Schema-Prüfung verhindert das
versehentlich: **ohne `author` + `licenseUrl` bricht der Build ab.**

Bilder holen (schreibt Datei + fertigen Frontmatter-Block):

```bash
node scripts/fetch-images.mjs shanghai \
  "bund=The Bund Shanghai skyline" \
  "yu-garten=Yu Garden Shanghai"
```

Einbauen:

```yaml
photo:
  file: 'shanghai/bund.jpg'
  alt: 'Skyline am Bund zur blauen Stunde'
  caption: 'Der Bund bei Nacht.'
  author: 'XY'
  license: 'CC BY-SA 4.0'
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0'
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:...'
```

Technik: `Photo.astro` erzeugt drei Breiten (400/680/960 px) als WebP, Quality 62.
Gemessen auf der Peking-Seite: 9 Fotos = **854 KB** in der größten Variante,
Hero 49 KB. Zielwerte: ≤ 15 Bilder/Seite, ≤ 1,5 MB gesamt, Hero `loading="eager"`.

