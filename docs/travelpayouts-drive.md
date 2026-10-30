# Travelpayouts Drive — bewusst deaktiviert

Account-ID im Script: `t=593357` (Pfad `NTkzMzU3` = Base64 davon).

## Warum nicht aktiv

Drive ist ein **Third-Party-Script auf jeder Seite**. Es schreibt die bestehenden
Partner-Links automatisch um und setzt dabei Cookie-/Storage-basierte Attribution.

Das kollidiert mit zwei Entscheidungen dieses Projekts:

1. `/datenschutz/` sagt zu: *keine Analyse-Skripte Dritter, keine Cookies der Seite*.
2. § 25 Abs. 1 TDDDG: Cookie-/Storage-Zugriff zu Werbezwecken ist **nicht** „unbedingt
   erforderlich" → Einwilligung müsste **vor** dem Laden eingeholt werden, also ein
   Consent-Layer her. Genau das wurde hier vermieden, um ohne Banner zu starten.

Stattdessen: **manuelle Tracking-Links** in `src/data/affiliates.ts` (6 Slots,
`rel="sponsored nofollow noopener"`, `Anzeige`-Badge). Nach Freigabe des Projekts
erzeugt man die Links im Travelpayouts-Dashboard über **Link builder / Get link** und
trägt sie dort ein — ein Deploy, sonst nichts.

## Original-Snippet (für den Fall der Aktivierung)

```html
<script>
  (function () {
    var script = document.createElement("script");
    script.async = 1;
    script.setAttribute("data-cmp-ab", "2");
    script.src = "https://emrldtp.cc/NTkzMzU3.js?t=593357";
    document.head.appendChild(script);
  })();
</script>
```

## Aktivieren (erst nach Consent)

1. Consent-Layer einbauen (DSK-konform: Ablehnen gleich prominent wie Annehmen,
   granulare Kategorien, Widerruf möglich, Einwilligung mit Zeitstempel + Version
   protokollieren — bei § 7a UWG 5 Jahre Aufbewahrung).
2. `/datenschutz/` um den Abschnitt „Affiliate-Netzwerk Travelpayouts" ergänzen.
3. Script **erst nach erteilter Einwilligung** laden (nicht im `<head>` dieser Seite,
   sondern per Loader im Consent-Zweig).
4. Block in `src/layouts/Base.astro` einkommentieren.

## Was „Verify installation" betrifft

Travelpayouts kann die Installation bei einer statischen Astro-Seite nicht zuverlässig
prüfen (kein WordPress-Plugin, kein serverseitiger Hook). Die Freigabe des Projekts
hängt an Website-Inhalt und Projektangaben, nicht am Script. Ein fehlgeschlagener
Verify-Schritt ist daher folgenlos.
