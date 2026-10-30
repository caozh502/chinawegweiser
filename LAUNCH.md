# Launch-Checkliste chinawegweiser.de

**Status: live seit 2026-10-30.** Die Schritte unten sind als Nachschlagewerk erhalten;
der aktuelle Stand steht hier:

| Schritt | Ergebnis |
|---|---|
| Domain | INWX, NS `simone.ns.cloudflare.com` / `arch.ns.cloudflare.com`, Zone aktiv |
| DNS | apex + www → CNAME `chinawegweiser.pages.dev`, proxied |
| Zertifikat | Google CA, `validation_data.status: active` |
| Pages | Projekt `chinawegweiser`, Branch `main`, 106 Dateien, Legal-Check ok |
| E-Mail | `kontakt@chinawegweiser.de` → `calebtsao@gmail.com`, MX `route1-3.mx.cloudflare.net`, DKIM + SPF |
| Search Console | DNS-TXT gesetzt, Eigentümerschaft bestätigt |
| SEO-Basis | og:image 1200×630, Twitter Large Card, BreadcrumbList, Article-Schema mit `dateModified` |
| Analytics | Beacon in `Base.astro` eingebaut, aktiv sobald `site.analyticsToken` gesetzt ist |

Verifiziert (`curl --resolve` gegen die Cloudflare-IP, plus Mobilfunk-Test):

```
200  /  ·  /www  ·  /stadt/peking/  ·  /sitemap-index.xml (xml, 14 URLs)  ·  /robots.txt  ·  /og-default.jpg
TTFB ≈ 60–85 ms
```

**Noch offen (< 2 Min pro Punkt):** Sitemap in GSC mit vollständiger URL einreichen ·
Web-Analytics-Token in `site.ts` · Always Use HTTPS aktivieren · HSTS · lokaler DNS-Cache
(Rechner löst noch `185.181.104.242` auf, öffentlich ist alles korrekt).

Registrar: INWX · Ziel: Cloudflare Pages

---

## 0. Voraussetzungen (einmalig, 5 Min)

| Was | Wer | Status |
|---|---|---|
| Domain `chinawegweiser.de` registriert | Caleb | ✅ erledigt |
| Kontakt-E-Mail festgelegt (echte, erreichbare Adresse) | Caleb | ⬜ |
| Werte in `src/data/site.ts` eingetragen | Hermes | ⬜ |
| Cloudflare-Konto vorhanden | Caleb | ⬜ |

---

## 1. Cloudflare: Zone hinzufügen (2 Min)

1. <https://dash.cloudflare.com> → **Add a site** → `chinawegweiser.de` → Plan **Free**
2. Cloudflare zeigt **zwei Nameserver**, z. B. `ada.ns.cloudflare.com` / `bob.ns.cloudflare.com`
3. Diese beiden notieren

## 2. INWX: Nameserver umstellen (2 Min)

1. <https://www.inwx.de> → Login → **Domains** → `chinawegweiser.de` → **Nameserver**
2. Standard-Nameserver (ns.inwx.de / ns2.inwx.de / ns3.inwx.eu) **entfernen**
3. Die zwei Cloudflare-Nameserver eintragen → speichern
4. Prüfen (dauert 5 Min bis 24 h):

```bash
nslookup -type=NS chinawegweiser.de 8.8.8.8
# erwartet: *.ns.cloudflare.com
```

## 3. E-Mail-Routing (5 Min, erst nach Schritt 2)

1. Cloudflare → `chinawegweiser.de` → **Email** → **Email Routing** → Enable
2. **Destination address** hinzufügen (private Mailadresse) → Bestätigungslink in der Mail klicken
3. **Custom address**: `kontakt@chinawegweiser.de` → Destination = die verifizierte Adresse
4. Testmail an `kontakt@chinawegweiser.de` schicken → muss ankommen

## 4. Deploy (10 Min)

**Variante A — direkter Upload (schnellster Weg live zu gehen)**

```bash
cd "C:/Users/Caleb Tsao/Hermes_generated/china-guide-de"
npx wrangler login          # Browser öffnet sich → "Allow" klicken
npm run deploy              # build → check:legal → pages deploy
```

Ergebnis: `https://chinawegweiser.pages.dev` ist sofort erreichbar (auch ohne eigene Domain).

**Variante B — Git-Integration (Auto-Deploy bei jedem Push)**

Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** →
Repo `caozh502/chinawegweiser` → Build command `npm run build && npm run check:legal`,
Output directory `dist`, Node 20.

## 5. Domain an das Pages-Projekt hängen (3 Min)

1. Pages-Projekt → **Custom domains** → `chinawegweiser.de` hinzufügen
2. `www.chinawegweiser.de` ebenfalls hinzufügen (leitet auf die Hauptdomain)
3. SSL/TLS-Modus: **Full (strict)**

Prüfen:

```bash
curl -sI https://chinawegweiser.de | head -5     # erwartet: 200
curl -s  https://chinawegweiser.de | grep -c "China Wegweiser"
```

## 6. Search Console (10 Min)

1. <https://search.google.com/search-console> → **Domain** (nicht URL-Präfix)
2. Cloudflare → DNS → **TXT**-Record anlegen mit dem Wert von Google
3. Nach Verifizierung: `https://chinawegweiser.de/sitemap-index.xml` einreichen
4. Bing Webmaster Tools: Sitemap importieren (übernimmt aus GSC)

---

## Abbruch: Was passiert, wenn die Domain nicht verlängert wird

1. **INWX** verlängert automatisch, wenn Guthaben vorhanden ist. Abschalten:
   Login → **Verlängerungen** → Domain wählen → Verlängerungsoption **„Löschen"**.
2. Nach Ablauf beginnt bei DENIC eine **30-tägige Redemption Grace Period (RGP)** —
   in dieser Zeit ist die Domain gegen Gebühr wiederherstellbar.
3. Danach wird die Domain **frei** und kann von Dritten registriert werden.
4. Der Inhalt bleibt bestehen: `chinawegweiser.pages.dev` läuft weiter, das GitHub-Repo
   enthält den kompletten Quellcode. Verloren gehen: Domain, Rankings, Backlinks,
   GSC-Historie.
5. Vor dem Aufgeben exportieren: GSC → Performance → **Export**, und
   `curl`-Sicherung von `dist/` (`cp -r dist ../chinawegweiser-archiv`).

**Kosten-Nutzen:** Verlängerung ≈ 5 €/Jahr. Ein Neustart auf einer neuen Domain kostet
6–12 Monate Indexierung. Nicht verlängern nur, wenn das Projekt inhaltlich beendet ist.
