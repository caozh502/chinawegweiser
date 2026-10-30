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
export type AffiliateSlot = {
  id: string;
  title: string;
  text: string;
  cta: string;
  url: string;
  hint?: string;
};

export const affiliates: Record<string, AffiliateSlot> = {
  esim: {
    id: 'esim',
    title: 'eSIM mit Datenroaming',
    text: 'Datenvolumen, das über einen ausländischen Netzausgang läuft – damit funktionieren Google, WhatsApp und Instagram ab der Landung wie gewohnt.',
    cta: 'eSIM vergleichen',
    url: 'https://www.airalo.com/de',
    hint: 'Der Preis bleibt gleich.',
  },
  hotels: {
    id: 'hotels',
    title: 'Hotels, die Ausländer aufnehmen',
    text: 'Bei der Buchung auf „akzeptiert ausländische Gäste" achten – seit Mai 2024 ist die Ablehnung verboten, kontrolliert wird es aber nicht überall.',
    cta: 'Hotels suchen',
    url: 'https://www.trip.com/',
    hint: 'Der Preis bleibt gleich.',
  },
  guide: {
    id: 'guide',
    title: 'Führung durch die Verbotene Stadt',
    text: 'Vierstündige Führung durch die Verbotene Stadt und über den Tiananmen-Platz, Eintritt inklusive, englischsprachiger Lizenzführer (4,8 von 5 bei über 11.000 Bewertungen).',
    cta: 'Führung ansehen',
    url: 'https://www.getyourguide.com/beijing-l186/4-hour-private-tour-to-tian-anmen-square-and-forbidden-city-t459862/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=guide-verbotene-stadt',
    hint: 'Der Preis bleibt gleich.',
  },
  tours: {
    id: 'tours',
    title: 'Führungen und Tickets mit Abholung',
    text: 'Für Sehenswürdigkeiten mit chinesischem Reservierungssystem ist eine geführte Variante oft der einfachste Weg hinein.',
    cta: 'Touren ansehen',
    url: 'https://www.getyourguide.com/beijing-l186/?partner_id=W7WGR77&utm_medium=online_publisher&cmp=peking-city',
    hint: 'Der Preis bleibt gleich.',
  },
  tickets: {
    id: 'tickets',
    title: 'Eintrittskarten ohne chinesische Bankkarte',
    text: 'Karten für Kaiserpalast, Mauerabschnitte und Ausflüge, buchbar mit deutscher oder internationaler Karte. Der Anbieter übernimmt die Reservierung mit deinen Passdaten; Bestätigung per E-Mail, Einlass per QR-Code.',
    cta: 'Ticket mit Reservierung',
    url: 'https://klook.tpo.lv/m98qHwa2?u=https%3A%2F%2Fwww.klook.com%2Fcity%2F57-beijing-things-to-do%2F',
    hint: 'Der Preis bleibt gleich.',
  },
  insurance: {
    id: 'insurance',
    title: 'Auslandskrankenversicherung',
    text: 'Ein Arztbesuch in China ohne Versicherung kostet schnell vierstellig. Jahresverträge gibt es ab etwa 12 €.',
    cta: 'Tarife vergleichen',
    url: 'https://www.allianzdirect.de/',
    hint: 'Der Preis bleibt gleich.',
  },
  train: {
    id: 'train',
    title: 'Zugtickets für Ausländer',
    text: 'Buchung über die englische 12306-Seite ist offiziell und günstiger, über Trip.com bequemer.',
    cta: 'Verbindungen prüfen',
    url: 'https://www.trip.com/trains/',
    hint: 'Der Preis bleibt gleich.',
  },
};
