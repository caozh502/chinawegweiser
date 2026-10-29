/**
 * Städte-Metadaten. Müssen in einer eigenen Datei liegen, weil Astros
 * getStaticPaths gehoisted wird und keine Variablen aus dem Frontmatter sieht.
 */
export const CITIES: Record<string, { name: string; intro: string }> = {
  peking: {
    name: 'Peking',
    intro:
      'Die meisten China-Reisen starten hier. Reservierungen sind Pflicht, fast jedes Ticket läuft über eine App mit chinesischer ID – hier steht, was mit Pass funktioniert.',
  },
  shanghai: {
    name: 'Shanghai',
    intro:
      'Die einfachste Stadt für den Einstieg: U-Bahn auf Englisch, viel Englisch im Service – aber bei Tickets und Taxi gelten dieselben Hürden wie überall.',
  },
  xian: {
    name: "Xi'an",
    intro:
      'Terrakotta-Armee, Stadtmauer, Muslim Quarter – die Klassiker mit den längsten Schlangen. Tickets für die Armee sind früh ausgebucht.',
  },
  chengdu: {
    name: 'Chengdu',
    intro:
      'Pandas, Teehäuser, Sichuan-Küche. Entspannter als Peking, aber die Pandabasis verlangt frühzeitige Reservierung.',
  },
  guilin: {
    name: 'Guilin',
    intro:
      'Li-Fluss, Yangshuo, Longji-Reisterrassen – hier entscheidet die Wahl des Abschnitts über den ganzen Aufenthalt.',
  },
};

export const CITY_ORDER = ['system', 'peking', 'shanghai', 'xian', 'chengdu', 'guilin'];

export const CITY_NAMES: Record<string, string> = {
  system: 'Praktisches',
  ...Object.fromEntries(Object.entries(CITIES).map(([k, v]) => [k, v.name])),
};
