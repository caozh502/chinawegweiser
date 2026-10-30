#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Zweiwöchiger Traffic-Report für chinawegweiser.de → Telegram.

Datenquelle: Cloudflare Web Analytics (GraphQL, RUM-Datensätze, gleiches Token
wie das Beacon auf der Seite). Es wird KEIN Skript auf der Website ergänzt und
kein Cookie gesetzt – nur die serverseitig vorhandenen Zahlen abgefragt.

Aufruf:
    python3 report.py            # sendet nur, wenn >= 13 Tage seit letztem Versand
    python3 report.py --force    # sendet immer
    python3 report.py --demo     # schickt Beispielzahlen (Test der Zustellung)
"""

import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

BASE = Path(__file__).resolve().parent
ENV_FILE = BASE / ".env"
STATE_FILE = BASE / "last_sent.txt"
LOG_FILE = BASE / "report.log"
CF_URL = "https://api.cloudflare.com/client/v4/graphql"
DAYS = 14


def log(msg):
    line = f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(line, flush=True)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def load_env():
    if not ENV_FILE.exists():
        return
    for raw in ENV_FILE.read_text(encoding="utf-8").splitlines():
        raw = raw.strip()
        if not raw or raw.startswith("#") or "=" not in raw:
            continue
        k, v = raw.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


# ---------------------------------------------------------------- Cloudflare

def cf_query(query: str, variables: dict) -> dict:
    token = os.environ["CF_API_TOKEN"]
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        CF_URL, data=body,
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        payload = json.loads(r.read().decode())
    if payload.get("errors"):
        raise RuntimeError("; ".join(e.get("message", "?") for e in payload["errors"]))
    return payload["data"]


def rum(dim: str, sum_field: str | None, start: date, end: date, limit: int = 20):
    """Eine RUM-Gruppenabfrage. sum_field=None → nur Treffer zählen."""
    sum_block = f"sum {{ {sum_field} }}" if sum_field else ""
    order = "[count_DESC]"
    q = f"""
    query($acct: String!, $from: Date!, $to: Date!, $tag: String!) {{
      viewer {{
        accounts(filter: {{ accountTag: $acct }}) {{
          rumPageloadEventsAdaptiveGroups(
            limit: {limit}
            filter: {{ date_geq: $from, date_leq: $to, siteTag: $tag }}
            orderBy: {order}
          ) {{
            count
            {sum_block}
            dimensions {{ {dim} }}
          }}
        }}
      }}
    }}
    """
    var = {
        "acct": os.environ["CF_ACCOUNT_ID"],
        "from": start.isoformat(),
        "to": end.isoformat(),
        "tag": os.environ.get("CF_SITE_TAG", ""),
    }
    data = cf_query(q, var)
    groups = list(data["viewer"]["accounts"])
    if not groups:
        raise RuntimeError("Account nicht gefunden")
    return groups[0]["rumPageloadEventsAdaptiveGroups"] or []


def rum_first(dims, sums, start, end, limit=20):
    """Probiert Dimensions-/Summen-Kombinationen durch, bis der GraphQL-Server
    eine akzeptiert (die Feldnamen der RUM-Datensätze ändern sich gelegentlich)."""
    last = None
    for dim in dims:
        for sum_field in sums:
            try:
                return rum(dim, sum_field, start, end, limit), dim, sum_field
            except Exception as e:  # noqa: BLE001
                last = e
                continue
    raise RuntimeError(f"keine passende Abfrage gefunden: {last}")


def value_of(row, sum_field):
    if sum_field:
        s = row.get("sum") or {}
        return int(s.get(sum_field) or 0)
    return int(row.get("count") or 0)


OWN_HOST = "chinawegweiser.de"


def collect(start: date, end: date):
    """Sitzungen (sum.visits, per IP+UA entdoppelt) für die Gesamtzahl,
    Aufrufe (count) für Seiten/Länder/Herkunft – sum.visits ist pro Seite
    nicht sinnvoll, weil eine Sitzung mehrere Seiten aufruft."""
    out = {}

    rows, _, _ = rum_first(["date"], ["visits"], start, end, limit=100)
    out["daily"] = [(str((r["dimensions"] or {}).get("date")), int((r.get("sum") or {}).get("visits") or 0)) for r in rows]
    out["visits"] = sum(v for _, v in out["daily"])

    rows, dim, _ = rum_first(["requestPath", "path"], [None], start, end, limit=8)
    out["pages"] = [(str((r["dimensions"] or {}).get(dim) or "?"), int(r.get("count") or 0)) for r in rows]
    out["views"] = sum(n for _, n in out["pages"])

    rows, dim, _ = rum_first(["countryName"], [None], start, end, limit=5)
    out["countries"] = [(str((r["dimensions"] or {}).get(dim) or "?"), int(r.get("count") or 0)) for r in rows]

    rows, dim, _ = rum_first(["refererHost"], [None], start, end, limit=6)
    refs = []
    for r in rows:
        host = str((r["dimensions"] or {}).get(dim) or "")
        label = "direkt" if not host else ("intern" if host == OWN_HOST else host)
        refs.append((label, int(r.get("count") or 0)))
    out["referers"] = refs
    return out


# ---------------------------------------------------------------- Telegram

def telegram(text: str) -> bool:
    token = os.environ.get("TG_BOT_TOKEN")
    chat = os.environ.get("TG_CHAT_ID")
    if not token or not chat:
        log("FEHLER: TG_BOT_TOKEN/TG_CHAT_ID fehlen")
        return False
    data = urllib.parse.urlencode({
        "chat_id": chat, "text": text,
        "parse_mode": "HTML", "disable_web_page_preview": "true",
    }).encode()
    req = urllib.request.Request(f"https://api.telegram.org/bot{token}/sendMessage", data=data)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            out = json.loads(r.read().decode())
        if not out.get("ok"):
            log("Telegram-Fehler: " + json.dumps(out)[:300])
            return False
        return True
    except Exception as e:  # noqa: BLE001
        log(f"Telegram-Ausnahme: {e}")
        return False


def fmt(n: int) -> str:
    return f"{n:,}".replace(",", ".")


def build_message(cur, prev, start, end):
    delta = cur["visits"] - prev["visits"]
    trend = "±0"
    if prev["visits"]:
        trend = f"{delta:+d} ({delta / prev['visits'] * 100:+.0f} %)"
    elif delta:
        trend = f"+{delta} (vorher 0)"

    lines = [
        "<b>China Wegweiser — 2-Wochen-Report</b>",
        f"{start:%d.%m.%Y} – {end:%d.%m.%Y}",
        "",
        f"Sitzungen: <b>{fmt(cur['visits'])}</b>  (davor {fmt(prev['visits'])})  {trend}",
        f"Aufrufe: {fmt(cur['views'])}",
    ]
    if cur["pages"]:
        lines += ["", "<b>Seiten (Aufrufe)</b>"]
        for path, n in cur["pages"][:6]:
            lines.append(f"· {fmt(n):>4}  {path}")
    else:
        lines += ["", "<i>Noch keine Seitenaufrufe erfasst.</i>"]
    if cur["referers"]:
        refs = ", ".join(f"{h or 'direkt'} {fmt(n)}" for h, n in cur["referers"][:4])
        lines += ["", f"<b>Herkunft:</b> {refs}"]
    if cur["countries"]:
        cs = ", ".join(f"{c} {fmt(n)}" for c, n in cur["countries"][:4])
        lines += [f"<b>Länder:</b> {cs}"]
    lines += ["", "<i>Search Console nicht verbunden – Impressions/Clicks fehlen.</i>"]
    return "\n".join(lines)


def demo_message():
    a = date.today() - timedelta(days=13)
    b = date.today()
    return "\n".join([
        "<b>China Wegweiser — 2-Wochen-Report</b>",
        f"{a:%d.%m.%Y} – {b:%d.%m.%Y}",
        "",
        "Sitzungen: <b>1</b>  (davor 0)  +1 (vorher 0)",
        "",
        "<b>Seiten</b>",
        "·    1  /stadt/peking/",
        "",
        "<b>Herkunft:</b> direkt 1",
        "<b>Länder:</b> United States 1",
        "",
        "<i>Testnachricht – Zahlen sind Beispieldaten.</i>",
    ])


def main():
    load_env()
    args = set(sys.argv[1:])

    if "--demo" in args:
        ok = telegram(demo_message())
        log(f"Demo gesendet: {ok}")
        return 0 if ok else 1

    missing = [k for k in ("CF_API_TOKEN", "CF_ACCOUNT_ID", "CF_SITE_TAG") if not os.environ.get(k)]
    if missing:
        log("Setup unvollständig, fehlt: " + ", ".join(missing))
        return 2

    last = None
    if STATE_FILE.exists():
        try:
            last = date.fromisoformat(STATE_FILE.read_text().strip())
        except ValueError:
            last = None
    if last and (date.today() - last).days < 13 and "--force" not in args:
        log(f"noch nicht fällig (zuletzt {last}) – nichts gesendet")
        return 0

    # Normalerweise bis gestern (der heutige Tag ist noch nicht vollständig).
    end = date.today() if "--to-today" in args else date.today() - timedelta(days=1)
    start = end - timedelta(days=DAYS - 1)
    prev_end = start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=DAYS - 1)

    try:
        cur = collect(start, end)
        prev = collect(prev_start, prev_end)
        if "--dry" in args:
            print(build_message(cur, prev, start, end))
            return 0
    except Exception as e:  # noqa: BLE001
        log(f"Cloudflare-Abfrage fehlgeschlagen: {e}")
        telegram(f"⚠️ China Wegweiser: Cloudflare-Abfrage fehlgeschlagen.\n<code>{str(e)[:250]}</code>")
        return 1

    msg = build_message(cur, prev, start, end)
    if telegram(msg):
        STATE_FILE.write_text(date.today().isoformat())
        log(f"gesendet: {cur['visits']} Sitzungen / {cur['views']} Aufrufe ({start} – {end})")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
