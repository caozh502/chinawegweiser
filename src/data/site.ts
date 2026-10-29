/** Eine Stelle für alles, was die Seite nach außen identifiziert. */
export const site = {
  name: 'China Wegweiser',
  domain: 'chinawegweiser.de',
  url: 'https://chinawegweiser.de',

  /** Pflichtangaben nach § 5 DDG (früher § 5 TMG). */
  owner: {
    name: 'Jiale Cao',
    /** Zustellzeile über der Straße, z. B. 'c/o Postflex'. Leer = keine Zustellzeile. */
    careOf: '',
    street: 'Scheinerstr. 29',
    zipCity: '81679 München',
    country: 'Deutschland',
    email: '', // z. B. 'kontakt@chinawegweiser.de'
    phone: '', // optional
  },

  /** Nur ausfüllen, wenn keine Kleinunternehmerregelung (§ 19 UStG) greift. */
  vatId: '',

  /** Cloudflare Web Analytics: Token aus dem Dashboard eintragen (optional). */
  analyticsToken: '',
} as const;

export const legalReady = Boolean(
  site.owner.name && site.owner.street && site.owner.zipCity && site.owner.email
);

export const contactEmail = site.owner.email || 'korrektur@example.com';
