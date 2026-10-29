/**
 * Eine Stelle für alles, was die Seite nach außen identifiziert.
 * Vor dem Livegang ausfüllen – Impressum, Datenschutz, Footer und alle
 * mailto-Links ziehen ihre Werte von hier.
 */
export const site = {
  name: 'China Wegweiser',
  domain: 'chinawegweiser.de',
  url: 'https://chinawegweiser.de',

  /** Pflichtangaben nach § 5 DDG (früher § 5 TMG). */
  owner: {
    name: '', // z. B. 'Jiale Cao'
    street: '', // Straße und Hausnummer
    zipCity: '', // PLZ und Ort
    country: 'Deutschland',
    email: '', // z. B. 'kontakt@chinawegweiser.de'
    phone: '', // optional, aber für schnelle Erreichbarkeit empfohlen
  },

  /** Nur ausfüllen, wenn keine Kleinunternehmerregelung (§ 19 UStG) greift. */
  vatId: '',

  /** Cloudflare Web Analytics: Token aus dem Dashboard eintragen (optional). */
  analyticsToken: '',
} as const;

/** true, sobald alle Pflichtangaben gesetzt sind. */
export const legalReady = Boolean(
  site.owner.name && site.owner.street && site.owner.zipCity && site.owner.email
);

/** E-Mail für Korrekturen (Fallback, solange nichts eingetragen ist). */
export const contactEmail = site.owner.email || 'korrektur@example.com';
