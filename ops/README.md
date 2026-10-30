# Traffic-Report (Telegram)

Zweiwöchentlicher Bericht über die Besucherzahlen von chinawegweiser.de.
Läuft auf dem VPS, nicht auf dem Schreibtisch – der Rechner muss nicht an sein.

## Wo was liegt

| Ort | Inhalt |
|---|---|
| VPS `~/china-report/report.py` | Skript (Quelle im Repo: `ops/report.py`) |
| VPS `~/china-report/.env` | `TG_BOT_TOKEN`, `TG_CHAT_ID`, `CF_ACCOUNT_ID`, `CF_SITE_TAG`, `CF_API_TOKEN` (chmod 600) |
| VPS `~/china-report/report.log` | eine Zeile pro Lauf |
| VPS `~/china-report/last_sent.txt` | Datum des letzten Versands (steuert den 13-Tage-Takt) |
| Crontab | `0 8 * * 1 cd /home/ubuntu/china-report && /usr/bin/python3 report.py >> report.log 2>&1` |

## Befehle

```bash
cd ~/china-report
python3 report.py --dry --to-today   # Nachricht nur ausgeben, nichts senden
python3 report.py --force --to-today # sofort senden, Takt ignorieren
python3 report.py                    # normaler Lauf (sendet nur, wenn fällig)
```

## Zwei Fallstricke, die Zeit gekostet haben

**1. `CF_SITE_TAG` ist NICHT der Beacon-Token.** Im HTML steht
`data-cf-beacon={"token": "6106c3a1…"}`, aber der GraphQL-Filter `siteTag`
erwartet die **Property-ID aus der Dashboard-URL**
(`web-analytics/edit/c3ff4b59…`). Mit dem falschen Wert liefert die Abfrage
kommentarlos `rows=0` – kein Fehler, nur Nullen. Wenn der Report plötzlich
wieder 0 zeigt, zuerst hier prüfen.

**2. `sum { visits }` gilt nur für die Gesamtzahl.** Pro Seite ist der Wert
unbrauchbar (eine Sitzung besucht mehrere Seiten, `visits` verteilt sich nicht).
Deshalb: Gesamtzahl = `sum.visits`, Seiten/Länder/Herkunft = `count` (Aufrufe).

Feldnamen der RUM-Datensätze: `requestPath`, `countryName`, `refererHost`,
`date`, `siteTag`. `path` existiert **nicht** (führt zu „unknown field").

## Metriken

- **Sitzungen** = `sum.visits`, per IP+User-Agent entdoppelt, 30-Minuten-Fenster.
  Entspricht Clouds „Visits", nicht „Unique visitors".
- **Aufrufe** = `count` der Page-Loads (eine Sitzung kann mehrere sein).
- Eigene Besuche mit Adblocker (uBlock/Brave Shields) werden **nicht** gezählt –
  das Beacon liegt auf `static.cloudflareinsights.com` und wird geblockt.
- Interne Navigation erscheint als Herkunft `intern` (Referer = eigene Domain).

## Token

`CF_API_TOKEN` ist ein Custom Token mit `Account Analytics: Read`, erstellt unter
`dash.cloudflare.com/profile/api-tokens`. Kein Ablaufdatum gesetzt; bei Verdacht
auf Missbrauch löschen und neu erzeugen, dann in `.env` ersetzen.

Der wrangler-OAuth-Token (`~/.wrangler/config/default.toml`) taugt dafür **nicht**:
er läuft alle paar Stunden ab und hat kein `Account Analytics`.

## Noch offen

Search Console (Impressions/Clicks) ist nicht angebunden – braucht OAuth über
Google Cloud und lohnt erst, wenn die Seite genug Seiten hat, dass GSC
überhaupt Daten zeigt.
