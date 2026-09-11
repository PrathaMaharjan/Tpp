/**
 * Central HTML entity decoder for CMS preview text.
 *
 * CMS stores Editor.js JSON with encoded entities inside blocks[].data.text,
 * e.g. "Texas Primary &amp; Pediatric Care in Irving&nbsp;&amp; Celina".
 * Detail pages render via dangerouslySetInnerHTML so the browser decodes
 * automatically, but card/preview paths strip tags and render as React text
 * nodes — entities would show literally without this decoder.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: "'",
  rsquo: "'",
  ldquo: '"',
  rdquo: '"',
  laquo: '«',
  raquo: '»',
};

function decodeOnce(str: string): string {
  return str.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const isHex = entity[1]?.toLowerCase() === 'x';
      const code = isHex
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      if (!isNaN(code) && code > 0) {
        try {
          return String.fromCodePoint(code);
        } catch {
          return match;
        }
      }
      return match;
    }
    const decoded = NAMED_ENTITIES[entity.toLowerCase()];
    return decoded !== undefined ? decoded : match;
  });
}

/**
 * Decodes HTML entities. Loops to handle double-encoded values
 * like `&amp;amp;` from the CMS. SSR-safe (no DOM dependency).
 */
export function decodeHtmlEntities(str: string): string {
  if (!str || !str.includes('&')) return str;
  let prev = str;
  for (let i = 0; i < 3; i++) {
    const next = decodeOnce(prev);
    if (next === prev) break;
    prev = next;
  }
  return prev;
}

/**
 * Strips HTML tags, decodes entities, and normalizes whitespace.
 * Use for all card/preview/excerpt text rendered as React strings.
 */
export function stripHtmlAndDecode(html?: string | null): string {
  if (!html) return '';
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, ''))
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
