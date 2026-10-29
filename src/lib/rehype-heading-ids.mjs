/**
 * Rehype-Plugin: gibt jedem H2 im Markdown eine stabile ID (Slug).
 * Ohne Plugin müsste man in jeder .md-Datei IDs von Hand schreiben.
 * Bewusst ohne Abhängigkeiten – nur die Top-Level-Knoten werden durchlaufen.
 */

const UMLAUT = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss', é: 'e', è: 'e', á: 'a', ó: 'o' };

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[äöüßéèáó]/g, (c) => UMLAUT[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
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
