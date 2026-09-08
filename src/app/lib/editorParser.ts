import edjsParser, { type CustomParsers, type ParserConfig, type DeepPartial } from 'editorjs-parser';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1200';

/**
 * Resolves local CMS image paths (e.g. /uploads/...) vs absolute Cloudinary/HTTP URLs.
 */
export function resolveImageUrl(url?: string | null, fallback: string = FALLBACK_IMAGE): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Custom block parsers for edjs-parser to tailor the design & branding
 */
const customParsers: CustomParsers = {
  header: (data) => {
    const lvl = data?.level || 2;
    const text = data?.text || '';
    if (lvl === 1) {
      return `<h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-10 mb-5 tracking-tight">${text}</h1>`;
    }
    if (lvl === 2) {
      return `<h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-8 mb-4 tracking-tight">${text}</h2>`;
    }
    if (lvl === 3) {
      return `<h3 class="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3 tracking-tight">${text}</h3>`;
    }
    return `<h4 class="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2">${text}</h4>`;
  },

  paragraph: (data) => {
    const text = data?.text || '';
    if (!text.trim()) return '';
    return `<p class="leading-relaxed text-slate-700 text-base sm:text-lg mb-6 font-normal">${text}</p>`;
  },

  quote: (data) => {
    const text = data?.text || '';
    const caption = data?.caption || '';
    return `
      <blockquote class="my-8 border-l-4 border-[#2596be] bg-[#f0f9ff]/70 p-6 rounded-r-2xl italic text-slate-800 shadow-xs">
        <p class="text-lg font-medium leading-relaxed">${text}</p>
        ${
          caption
            ? `<cite class="block text-xs font-bold uppercase tracking-wider text-[#2596be] not-italic mt-3">— ${caption}</cite>`
            : ''
        }
      </blockquote>
    `;
  },

  list: (data) => {
    const isOrdered = data?.style === 'ordered';
    const tag = isOrdered ? 'ol' : 'ul';
    const items = (data?.items || [])
      .map((item: any) => {
        const val = typeof item === 'string' ? item : item?.content || '';
        return `<li class="leading-relaxed pl-1">${val}</li>`;
      })
      .join('');
    return `<${tag} class="${
      isOrdered ? 'list-decimal' : 'list-disc'
    } pl-6 space-y-2.5 my-6 text-slate-700 text-base sm:text-lg">${items}</${tag}>`;
  },

  image: (data) => {
    const rawUrl = data?.file?.url || data?.url;
    const imgUrl = resolveImageUrl(rawUrl);
    const caption = data?.caption || '';
    return `
      <figure class="my-8">
        <div class="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-50">
          <img src="${imgUrl}" alt="${caption || 'Article image'}" class="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
        </div>
        ${caption ? `<figcaption class="text-center text-xs text-slate-500 mt-2 italic">${caption}</figcaption>` : ''}
      </figure>
    `;
  },

  delimiter: () => {
    return `<div class="my-10 flex items-center justify-center gap-2"><div class="w-2 h-2 rounded-full bg-[#2596be]/40"></div><div class="w-2 h-2 rounded-full bg-[#2596be]"></div><div class="w-2 h-2 rounded-full bg-[#2596be]/40"></div></div>`;
  },
};

const parserConfig: DeepPartial<ParserConfig> = {
  delimiter: { tag: 'hr' },
  paragraph: { pClass: 'leading-relaxed text-slate-700 text-base sm:text-lg mb-6 font-normal' },
  code: { codeBlockClass: 'bg-slate-900 text-slate-100 p-4 rounded-xl my-6 text-sm overflow-x-auto font-mono' },
};

// Singleton edjs-parser instance
export const edjsParserInstance = new edjsParser(parserConfig, customParsers);

/**
 * Universal function to parse Editor.js output or fallback content using edjs-parser
 * Works for Blog, About, Services, Providers, etc.
 */
export function parseEditorJs(rawContent?: string | null, fallbackText: string = ''): string {
  if (!rawContent || !rawContent.trim()) return fallbackText;

  // 1. Try parsing Editor.js JSON blocks with edjs-parser
  try {
    const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
    if (parsed && Array.isArray(parsed.blocks)) {
      return edjsParserInstance.parse(parsed);
    }
  } catch {
    // Not valid JSON, proceed to raw HTML or plain text handling
  }

  // 2. If it is already HTML, return directly
  if (rawContent.includes('<p>') || rawContent.includes('<div>') || rawContent.includes('<h1>') || rawContent.includes('<h2>')) {
    return rawContent;
  }

  // 3. If it's plain text with newlines, convert to paragraphs
  return rawContent
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p class="leading-relaxed text-slate-700 text-base sm:text-lg mb-6 font-normal">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export default edjsParserInstance;
