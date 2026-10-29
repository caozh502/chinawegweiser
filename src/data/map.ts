/**
 * Kartenkacheln – eine Stelle zum Wechseln.
 *
 * Standard: OpenStreetMap-Rohkacheln. Für den Start okay, aber bitte beachten:
 * osm.org erlaubt sie nur für "leichte" Nutzung und verlangt einen erkennbaren
 * Referer/User-Agent. Sobald die Seite Traffic bekommt, auf einen Anbieter mit
 * Vertrag wechseln, z. B. MapTiler (100.000 Kacheln/Monat gratis):
 *
 *   url: 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=DEIN_KEY'
 *   attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 *
 * Der Code liest die Werte aus data-Attributen – ein Wechsel hier reicht.
 */
export const mapTiles = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
  maxZoom: 18,
};
