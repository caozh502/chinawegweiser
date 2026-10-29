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
  hotels: z.array(hotel).default([]),
});

const sight = z.object({
  no: z.number().int().min(1).max(20),
  name: z.string(),
  german: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  booking: z.enum(['required', 'recommended', 'none']).default('none'),
  note: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  photo: photo.optional(),
});

const plan = z.object({
  title: z.string(),
  forWhom: z.string().optional(),
  days: z.array(
    z.object({
      day: z.number().int().min(1),
      sights: z.array(z.number().int()),
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
    days: z.string(),
    season: z.string().optional(),
    budget: z.string().optional(),
    base: z.string().optional(),
    hero: photo,
    sights: z.array(sight).default([]),
    plans: z.array(plan).default([]),
    areas: z.array(area).default([]),
    connections: z.array(connection).default([]),
    bookAhead: z.array(z.string()).default([]),
    traps: z.array(z.string()).default([]),
    status: z.enum(['verified', 'draft', 'stale']).default('draft'),
    verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    sources: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    affiliate: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

export const collections = { guides, cities };
