/**
 * Affiliate-Slots. Werden pro Seite im Frontmatter aktiviert:
 *   affiliate: ['esim', 'hotels']
 *
 * TODO: eigene Tracking-Links einsetzen, sobald die Programme freigeschaltet sind.
 *      Airalo   -> partners.airalo.com
 *      Klook    -> affiliate.klook.com
 *      GYG      -> partner.getyourguide.com
 *      Trip.com -> trip.com/partners
 *      Awin     -> Allianz Direct, HanseMerkur
 *
 * Konditionen bewusst nicht im Code: Das Repo ist öffentlich, und die
 * Provisionshöhe gehört nicht auf die Website.
 */
export type SlotVariant = { title?: string; text?: string; cta?: string; url: string };

export type AffiliateSlot = {
  id: string;
  title: string;
  text: string;
  cta: string;
  url: string;
  /** Stadtspezifische Ziele; Fallback ist `url`. */
  urls?: Record<string, string>;
  /**
   * Wenn nicht nur das Ziel, sondern auch der Text stadtabhängig ist
   * (eine „Führung durch die Verbotene Stadt" darf auf der Shanghai-Seite
   * nicht auftauchen). Hat Vorrang vor `urls`.
   */
  perCity?: Record<string, SlotVariant>;
  /**
   * false = noch kein eigener Tracking-Link. Dann KEINE Kennzeichnung als
   * Anzeige und kein „Der Preis bleibt gleich" – sonst behauptet die Seite
   * eine Provision, die sie nicht bekommt.
   */
  tracked?: boolean;
  hint?: string;
};

export const affiliates: Record<string, AffiliateSlot> = {
  esim: {
    id: 'esim',
    title: 'eSIM mit Datenroaming',
    text: 'Datenvolumen, das über einen ausländischen Netzausgang läuft – damit funktionieren Google, WhatsApp und Instagram ab der Landung wie gewohnt.',
    cta: 'eSIM vergleichen',
    url: 'https://airalo.tpo.lv/Ad9F1LDB?u=https%3A%2F%2Fwww.airalo.com%2Fde%2Fchina-esim',
    hint: 'Der Preis bleibt gleich.',
  },
  hotels: {
    id: 'hotels',
    title: 'Hotels, die Ausländer aufnehmen',
    text: 'Bei der Buchung auf „akzeptiert ausländische Gäste" achten – seit Mai 2024 ist die Ablehnung verboten, kontrolliert wird es aber nicht überall.',
    cta: 'Hotels suchen',
    tracked: false,
    url: 'https://www.trip.com/hotels/beijing-hotels-list-1/',
    urls: {
      peking: 'https://www.trip.com/hotels/beijing-hotels-list-1/',
      shanghai: 'https://www.trip.com/hotels/shanghai-hotels-list-2/',
      chengdu: 'https://www.trip.com/hotels/chengdu-hotels-list-28/',
      xian: 'https://www.trip.com/hotels/xi-an-hotels-list-10/',
    },
    hint: 'Der Preis bleibt gleich.',
  },
  guide: {
    id: 'guide',
    title: 'Führung durch die Verbotene Stadt',
    text: 'Vierstündige Führung durch die Verbotene Stadt und über den Tiananmen-Platz, Eintritt inklusive, englischsprachiger Lizenzführer (4,8 von 5 bei über 11.000 Bewertungen).',
    cta: 'Führung ansehen',
    url: 'https://www.getyourguide.com/beijing-l186/4-hour-private-tour-to-tian-an-men-square-and-forbidden-city-t459862/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=guide-verbotene-stadt',
    urls: {
      peking: 'https://www.getyourguide.com/beijing-l186/4-hour-private-tour-to-tian-an-men-square-and-forbidden-city-t459862/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=guide-verbotene-stadt',
      xian: 'https://www.getyourguide.de/xi-an-l270/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=xian-guide',
      shanghai: 'https://www.getyourguide.com/shanghai-l178/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=shanghai-guide',
      chengdu: 'https://www.getyourguide.com/chengdu-l1697/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=chengdu-guide',
    },
    perCity: {
      shanghai: {
        title: 'Führung am Bund und durch die Altstadt',
        text: 'Die Kolonialbauten am Bund und der Yu-Garten erklären sich nicht von selbst. Geführte Rundgänge mit englischsprachigem Guide, meist mit Eintritt und Teepause.',
        cta: 'Führungen ansehen',
        url: 'https://www.getyourguide.com/shanghai-l178/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=shanghai-guide',
      },
      chengdu: {
        title: 'Führung durch die Pandabasis und die Altstadt',
        text: 'Die Anlage ist groß und die Wege führen an leeren Gehegen vorbei. Geführte Touren starten vor der Öffnung, damit man vor den Bussen an den Jungtieren ist – englischsprachig, Eintritt meist inklusive.',
        cta: 'Touren ansehen',
        url: 'https://www.getyourguide.com/chengdu-l1697/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=chengdu-guide',
      },
      xian: {
        title: 'Führung durch die Terrakotta-Armee',
        text: 'Vor 8.000 Figuren entscheidet die Erklärung darüber, ob man eine Halle sieht oder ein Grab. Führungen mit Eintritt und Abholung, englischsprachig.',
        cta: 'Führung ansehen',
        url: 'https://www.getyourguide.de/xi-an-l270/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=xian-guide',
      },
    },
    hint: 'Der Preis bleibt gleich.',
  },
  tours: {
    id: 'tours',
    title: 'Führungen und Tickets mit Abholung',
    text: 'Für Sehenswürdigkeiten mit chinesischem Reservierungssystem ist eine geführte Variante oft der einfachste Weg hinein.',
    cta: 'Touren ansehen',
    url: 'https://www.getyourguide.com/beijing-l186/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=peking-city',
    urls: {
      peking: 'https://www.getyourguide.com/beijing-l186/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=peking-city',
      xian: 'https://www.getyourguide.de/xi-an-l270/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=xian-city',
      shanghai: 'https://www.getyourguide.com/shanghai-l178/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=shanghai-city',
      chengdu: 'https://www.getyourguide.com/chengdu-l1697/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=chengdu-city',
    },
    hint: 'Der Preis bleibt gleich.',
  },
  tickets: {
    id: 'tickets',
    title: 'Eintrittskarten ohne chinesische Bankkarte',
    text: 'Karten für Kaiserpalast, Mauerabschnitte und Ausflüge, buchbar mit deutscher oder internationaler Karte. Der Anbieter übernimmt die Reservierung mit deinen Passdaten; Bestätigung per E-Mail, Einlass per QR-Code.',
    cta: 'Ticket mit Reservierung',
    url: 'https://klook.tpo.lv/m98qHwa2?u=https%3A%2F%2Fwww.klook.com%2Fde%2Fdestination%2Fc57-beijing%2F1-things-to-do%2F',
    urls: {
      peking: 'https://klook.tpo.lv/m98qHwa2?u=https%3A%2F%2Fwww.klook.com%2Fde%2Fdestination%2Fc57-beijing%2F1-things-to-do%2F',
      xian: 'https://klook.tpo.lv/m98qHwa2?u=https%3A%2F%2Fwww.klook.com%2Fde%2Fdestination%2Fc60-xi-an%2F1-things-to-do%2F',
      shanghai: 'https://klook.tpo.lv/m98qHwa2?u=https%3A%2F%2Fwww.klook.com%2Fde%2Fdestination%2Fc59-shanghai%2F1-things-to-do%2F',
      chengdu: 'https://klook.tpo.lv/m98qHwa2?u=https%3A%2F%2Fwww.klook.com%2Fde%2Fdestination%2Fc61-chengdu%2F1-things-to-do%2F',
    },
    hint: 'Der Preis bleibt gleich.',
  },
  insurance: {
    id: 'insurance',
    title: 'Auslandskrankenversicherung',
    text: 'Ein Arztbesuch in China ohne Versicherung kostet schnell vierstellig. Jahresverträge gibt es ab etwa 12 €.',
    cta: 'Tarife vergleichen',
    tracked: false,
    url: 'https://www.allianzdirect.de/',
    hint: 'Der Preis bleibt gleich.',
  },
  train: {
    id: 'train',
    title: 'Zugtickets für Ausländer',
    text: 'Buchung über die englische 12306-Seite ist offiziell und günstiger, über Trip.com bequemer.',
    cta: 'Verbindungen prüfen',
    tracked: false,
    url: 'https://www.trip.com/trains/',
    hint: 'Der Preis bleibt gleich.',
  },
};

/** Liefert den Slot mit stadtabhängigem Text und Ziel (Fallback: Standardwerte). */
export function slotFor(name: string, city?: string) {
  const a = affiliates[name];
  if (!a) return undefined;
  const v = city ? a.perCity?.[city] : undefined;
  return {
    ...a,
    title: v?.title ?? a.title,
    text: v?.text ?? a.text,
    cta: v?.cta ?? a.cta,
    url: v?.url ?? (city ? a.urls?.[city] : undefined) ?? a.url,
  };
}
