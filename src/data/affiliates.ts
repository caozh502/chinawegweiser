/**
 * Affiliate-Slots. Werden pro Seite im Frontmatter aktiviert:
 *   affiliate: ['esim', 'hotels']
 *
 * TODO: eigene Tracking-Links einsetzen, sobald die Programme freigeschaltet sind.
 *      Airalo  -> partners.airalo.com (10–12 %)
 *      Klook   -> affiliate.klook.com  (eSIM ~20 %, Touren ~6,5 %)
 *      GYG     -> partner.getyourguide.com (8 %)
 *      Trip.com-> trip.com/partners (Hotels 5–7 %)
 *      Awin    -> Allianz Direct ~30 €/Abschluss, HanseMerkur 12 %
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
    url: 'https://www.airalo.com/',
    hint: 'Wir bekommen eine Provision, der Preis bleibt gleich.',
  },
  hotels: {
    id: 'hotels',
    title: 'Hotels, die Ausländer aufnehmen',
    text: 'Bei der Buchung auf „akzeptiert ausländische Gäste" achten – seit Mai 2024 ist die Ablehnung verboten, kontrolliert wird es aber nicht überall.',
    cta: 'Hotels suchen',
    url: 'https://www.trip.com/',
    hint: 'Affiliate-Link (Trip.com, 5–7 %).',
  },
  tours: {
    id: 'tours',
    title: 'Führungen und Tickets mit Abholung',
    text: 'Für Sehenswürdigkeiten mit chinesischem Reservierungssystem ist eine geführte Variante oft der einfachste Weg hinein.',
    cta: 'Touren ansehen',
    url: 'https://www.getyourguide.de/',
    hint: 'Affiliate-Link (GetYourGuide, 8 %).',
  },
  insurance: {
    id: 'insurance',
    title: 'Auslandskrankenversicherung',
    text: 'Ein Arztbesuch in China ohne Versicherung kostet schnell vierstellig. Jahresverträge gibt es ab etwa 12 €.',
    cta: 'Tarife vergleichen',
    url: 'https://www.allianz-direct.de/',
    hint: 'Affiliate-Link (Awin).',
  },
  train: {
    id: 'train',
    title: 'Zugtickets für Ausländer',
    text: 'Buchung über die englische 12306-Seite ist offiziell und günstiger, über Trip.com bequemer.',
    cta: 'Verbindungen prüfen',
    url: 'https://www.trip.com/trains/',
    hint: 'Affiliate-Link (Trip.com, ca. 2 %).',
  },
};
