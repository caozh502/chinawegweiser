import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Bild mit Pflicht-Attribution. Fehlt sie, bricht der Build ab. */
const photo = z.object({
  file: z.string(), // relativ zu src/assets, z. B. 'peking/hero-jingshan.jpg'
  alt: z.string().min(3),
  author: z.string().min(2),
  license: z.string().min(2),
  licenseUrl: z.string().url(),
  sourceUrl: z.string().url(),
  caption: z.string().optional(),
});

const hotel = z.object({
  name: z.string(),
  stars: z.number().optional(),
  rating: z.number().optional(),
  reviews: z.string().optional(),
  note: z.string().optional(),
});

const area = z.object({
  name: z.string(),
  pro: z.string().optional(),
  con: z.string().optional(),
  /** Ungefähre Mitte des Viertels – für die Karte. */
  lat: z.number().optional(),
  lng: z.number().optional(),
  hotels: z.array(hotel).default([]),
});

const sight = z.object({
  no: z.number().int().min(1).max(20),
  /** Chinesischer Name – steht in der Kartenlegende zuerst. */
  name: z.string(),
  /** Umschrift, nur im Text der Sehenswürdigkeit. */
  pinyin: z.string().optional(),
  german: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  booking: z.enum(['required', 'recommended', 'none']).default('none'),
  /** Pflicht oder Kür: 'must' bekommt Video und alle Fakten, 'optional' bleibt kurz. */
  tier: z.enum(['must', 'optional']).default('must'),
  /** Nur bei 'optional': ehrliche Einordnung, wenn der Ort die Zeit nicht wert ist. */
  warn: z.string().optional(),
  note: z.string().optional(),
  /** Was in Gehweite liegt und den Weg lohnt – steht als eigene Zeile in der Karte. */
  nearby: z.string().optional(),
  /** Begründung, warum hier eine Führung hilft (erscheint als eigener Kasten). */
  guideNote: z.string().optional(),
  /** Welcher Affiliate-Slot den Führungs-Link liefert (z. B. 'tours'). */
  guideSlot: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  /** Öffnungszeiten im Klartext, inkl. Saisonunterschiede. */
  hours: z.string().optional(),
  /** Schließtage – der häufigste Grund für einen umsonst gefahrenen Weg. */
  closed: z.string().optional(),
  /** Nächste Haltestelle mit Ausgang, z. B. 'U-Bahn 1, Tian'anmen Ost, Ausgang B'. */
  transit: z.string().optional(),
  /** Mehrere Tarife (Saison, Zusatzausstellung) statt einer Preisspanne. */
  tickets: z
    .array(z.object({ label: z.string(), price: z.string(), note: z.string().optional() }))
    .default([]),
  /** Offizielle Seite des Orts – nur wenn sie sich lohnt (Buchung, Öffnungszeiten). */
  /** Empfohlener Weg zum Ticket – wird fett gesetzt und steht vorn. */
  buyTickets: z.string().optional(),
  /** Alles andere: Alternativen, Vorverkaufsfristen, Hinweise am Tor. */
  buyTicketsAlt: z.string().optional(),
  /** Direktlink zur Buchung, falls vorhanden. */
  ticketUrl: z.string().optional(),
  /** Sprachanzeige hinter dem Ticket-Link, z. B. 'Ticketseite (englisch)'. */
  ticketLabel: z.string().optional(),
  /** Schlüssel eines WeChat-Mini-Programm-Codes (Datei src/assets/peking/qr-<key>.png). */
  qr: z.string().optional(),
  /** Was der Code öffnet und wofür er gut ist. */
  qrNote: z.string().optional(),
  photo: photo.optional(),
  /** Weitere Fotos: Eingang, Innenraum, Details. Erstes Bild bleibt `photo`. */
  photos: z.array(photo).default([]),
  /** Ein Video, das den Ort zeigt – Sprache ehrlich angegeben. */
  video: z
    .object({
      id: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
      title: z.string(),
      channel: z.string(),
      lang: z.enum(['de', 'en']).default('de'),
    })
    .optional(),
});

const plan = z.object({
  title: z.string(),
  forWhom: z.string().optional(),
  days: z.array(
    z.object({
      day: z.number().int().min(1),
      sights: z.array(z.number().int()),
      morning: z.string().optional(),
      afternoon: z.string().optional(),
      evening: z.string().optional(),
      note: z.string().optional(),
    })
  ),
});

const connection = z.object({
  mode: z.string(),
  time: z.string(),
  price: z.string().optional(),
  note: z.string().optional(),
});

/**
 * Einzelne Fragen-Seiten (eine Seite = ein Suchintent).
 * status verified | draft | stale · verified = Datum der letzten Prüfung
 */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    answer: z.string(),
    city: z.string(),
    category: z.string(),
    price: z.string().optional(),
    duration: z.string().optional(),
    status: z.enum(['verified', 'draft', 'stale']).default('draft'),
    verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    sources: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    /** Aufmacherfoto. Pflicht wird es, sobald alle Seiten eins haben. */
    hero: photo.optional(),
    chinese: z
      .object({ name: z.string(), address: z.string(), note: z.string().optional() })
      .optional(),
    affiliate: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    order: z.number().default(100),
  }),
});

/** Städte-Seiten: die dicken Übersichtsseiten (Pendant zu oumengke tid=127). */
const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    city: z.string(),
    intro: z.string(),
    /** Ein bis zwei Sätze für den Teaser auf der Startseite. */
    teaser: z.string().optional(),
    /** Überschrift der Teaser-Karte – sagt, was drin ist. */
    teaserTitle: z.string().optional(),
    days: z.string(),
    season: z.string().optional(),
    budget: z.string().optional(),
    base: z.string().optional(),
    hero: photo,
    sights: z.array(sight).default([]),
    /** Dinge, die man tut statt ansieht – Essen, Eis, Radtour. */
  experiences: z
    .array(
      z.object({
        name: z.string(),
        pinyin: z.string().optional(),
        german: z.string(),
        when: z.string().optional(),
        price: z.string().optional(),
        text: z.string(),
        tip: z.string().optional(),
        /** Nur bei Routen: die Stationen in Reihenfolge. */
        steps: z.array(z.string()).default([]),
        photo: photo.optional(),
      })
    )
    .default([]),
  plans: z.array(plan).default([]),
    areas: z.array(area).default([]),
    connections: z.array(connection).default([]),
    bookAhead: z.array(z.string()).default([]),
    traps: z.array(z.string()).default([]),
    status: z.enum(['verified', 'draft', 'stale']).default('draft'),
    verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    /** Was sich geändert hat – macht das Prüfdatum überprüfbar. */
    changelog: z.array(z.object({ date: z.string(), text: z.string() })).default([]),
    sources: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    affiliate: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

export const collections = { guides, cities };
