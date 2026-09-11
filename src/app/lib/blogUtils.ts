const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';

import { stripHtmlAndDecode } from './htmlEntities';

export const FALLBACK_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1200';

/**
 * Resolves local CMS image paths (e.g. /uploads/...) vs absolute Cloudinary/HTTP URLs.
 */
export function resolveImageUrl(
  url?: string | null,
  fallback: string = FALLBACK_BLOG_IMAGE
): string {
  if (!url || !url.trim()) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanBase = CMS_URL.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * Calculates approximate reading time in minutes based on total word count.
 */
export function calculateReadTime(content?: string | null): string {
  if (!content || !content.trim()) return '2 min read';

  let rawText = '';
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed?.blocks)) {
      rawText = stripHtmlAndDecode(
        parsed.blocks.map((b: any) => b.data?.text || '').join(' ')
      );
    }
  } catch {
    rawText = stripHtmlAndDecode(content);
  }

  const words = rawText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Formats ISO date string into readable human format, e.g. "Oct 14, 2025"
 */
export function formatBlogDate(dateStr?: string | null): string {
  if (!dateStr) return 'Recently published';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently published';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently published';
  }
}

/**
 * Extracts a clean textual excerpt from custom excerpt field or Editor.js JSON content.
 */
export function parseExcerpt(
  excerpt?: string | null,
  content?: string | null,
  maxLength: number = 160
): string {
  if (excerpt && excerpt.trim()) {
    const trimmed = stripHtmlAndDecode(excerpt);
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength).trim()}...`;
  }

  if (!content) return 'Read the latest healthcare insights, pediatric advice, and medical updates from Texas Primary & Pediatric Care.';

  let plain = '';
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed?.blocks)) {
      for (const b of parsed.blocks) {
        if (typeof b.data?.text === 'string' && b.data.text.trim()) {
          plain = stripHtmlAndDecode(b.data.text);
          break;
        }
      }
    }
  } catch {
    plain = stripHtmlAndDecode(content);
  }

  if (!plain) {
    return 'Read the latest healthcare insights, pediatric advice, and medical updates from Texas Primary & Pediatric Care.';
  }

  return plain.length > maxLength ? `${plain.slice(0, maxLength).trim()}...` : plain;
}

import { parseEditorJs } from './editorParser';

/**
 * Parses Editor.js JSON or rich HTML into styled HTML markup using edjs-parser.
 */
export function parseRichBlogContent(rawContent?: string | null): string {
  return parseEditorJs(rawContent);
}

