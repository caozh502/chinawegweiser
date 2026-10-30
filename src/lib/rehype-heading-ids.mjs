/**
 * Rehype-Plugin: gibt jedem H2 im Markdown eine stabile ID (Slug).
 * Ohne Plugin müsste man in jeder .md-Datei IDs von Hand schreiben.
 * Bewusst ohne Abhängigkeiten – nur die Top-Level-Knoten werden durchlaufen.
 */

/* Muss exakt das erzeugen, was Astros eingebauter Slugger macht (github-slugger):
   Umlaute BLEIBEN stehen, Apostrophe fallen weg. Sonst zeigt das Inhaltsverzeichnis
   auf IDs, die es auf der Seite nicht gibt. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/['\u2019`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function textOf(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value || '';
  if (Array.isArray(node.children)) return node.children.map(textOf).join('');
  return '';
}

export default function headingIds() {
  return (tree) => {
    const used = new Set();
    for (const node of tree.children ?? []) {
      if (node.type !== 'heading' || node.depth < 2) continue;
      const base = slugify(textOf(node)) || `abschnitt-${node.depth}`;
      let id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      node.data = node.data || {};
      node.data.hProperties = { ...(node.data.hProperties || {}), id };
    }
  };
}
