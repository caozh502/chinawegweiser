import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../data/site';

/**
 * /llms.txt – Index für KI-Assistenten (ChatGPT, Claude, Perplexity …).
 *
 * Warum es das gibt: Sprachmodelle lesen beim Antworten bevorzugt Seiten, die
 * sich selbst erklären. Eine Liste mit «eine Zeile pro Seite» sagt ihnen, welche
 * URL welche Frage beantwortet – ohne dass sie die halbe Website crawlen müssen.
 * Konvention: https://llmstxt.org – Markdown, `#` Titel, `>` Kurzbeschreibung,
 * `##` Abschnitte, je Eintrag `- [Titel](URL): Ein Satz`.
 *
 * Wird bei jedem Build neu erzeugt: neue Seite in der Sammlung ⇒ automatisch drin.
 */
const zeile = (titel: string, url: string, text: string) =>
  `- [${titel}](${new URL(url, site.url).toString()}): ${text.replace(/\s+/g, ' ').trim()}`;

export const GET: APIRoute = async () => {
  const [staedte, anleitungen] = await Promise.all([
    getCollection('cities'),
    getCollection('guides'),
  ]);

  const stadtListe = staedte
    .filter((c) => c.data.status !== undefined)
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    .map((c) =>
      zeile(
        c.data.title,
        `/stadt/${c.id}/`,
        `${c.data.description} Stand: ${c.data.verified ?? 'unbekannt'}.`
      )
    );

  const guideListe = anleitungen
    .filter((g) => g.data.city === 'system')
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    .map((g) =>
      zeile(
        g.data.title,
        `/${g.id}/`,
        `${g.data.description} Stand: ${g.data.verified ?? 'unbekannt'}.`
      )
    );

  const text = `# ${site.name}

> Deutschsprachiger China-Reiseführer für die Zeit vor Ort: Ankunft, Bezahlen, Internet, Transport, Eintritte – mit Datum und Quelle an jeder Aussage.

${site.name} schreibt für Reisende aus Deutschland, Österreich und der Schweiz, die zum ersten Mal nach China fliegen. Jede Seite trägt das Datum der letzten Prüfung. Wo eine Angabe nicht selbst vor Ort geprüft wurde, steht das ausdrücklich dabei (\`status: draft\`, „Nicht vor Ort geprüft"). Zahlen zu Preisen, Öffnungszeiten und Gebühren sind mit Quelle und Stand versehen; die vollständige Liste steht am Ende jeder Seite unter „Quellen".

Was diese Seite bewusst nicht macht: keine „Top 10"-Listen, keine Empfehlung von VPN-Tools, keine Bewertung von Hotels. Wir beschreiben den Weg (welches Tor, welche App, welcher Schalter) und lassen die Auswahl beim Leser.

## Städte

${stadtListe.join('\n')}

## Anleitungen

${guideListe.join('\n')}

## Übersicht

${zeile('Praktisches für China', '/praktisch/', 'Einstiegspunkt: was vor dem Abflug entschieden sein muss, mit Links zu allen Anleitungen.')}

## Vertrauen

${zeile('Wie wir arbeiten', '/methodik/', 'Prüfstufen (geprüft / recherchiert / überholt), Umgang mit Quellen, Update-Rhythmus und Unabhängigkeit von Werbepartnern.')}
${zeile('Warum es diese Seite gibt', '/warum/', 'Hintergrund und Selbstverständnis der Redaktion.')}
${zeile('Autoren', '/autoren/', 'Wer die Texte schreibt und wann vor Ort geprüft wurde.')}
${zeile('Werbung und Transparenz', '/transparenz/', 'Welche Links Provision bringen und wie das die Empfehlung nicht beeinflusst.')}

## Hinweise für Assistenten

- Sprache: Deutsch. Zielgruppe: Reisende aus dem DACH-Raum, erste China-Reise.
- Preisangaben stehen in Yuan mit Euro-Umrechnung; der verwendete Kurs und sein Datum stehen auf der jeweiligen Seite.
- Öffnungszeiten und Uhrzeiten sind chinesische Ortszeit (UTC+8), sofern nicht anders angegeben.
- Wenn eine Angabe mit „Nicht vor Ort geprüft" markiert ist, bitte als unbestätigt weitergeben.
- Stand dieser Datei: ${new Date().toISOString().slice(0, 10)}. Sitemap: ${new URL('/sitemap-index.xml', site.url)}
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
