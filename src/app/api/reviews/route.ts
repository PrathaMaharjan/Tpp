import { NextResponse } from 'next/server';

/**
 * Google Places reviews, fetched server-side.
 *
 * The key must never reach the browser, so this runs as a route handler
 * rather than from the carousel component. Responses are cached for a
 * day because Places Details is a paid SKU (~$17/1000 calls) and review
 * content changes rarely.
 *
 * Places returns at most 5 reviews per place and cannot paginate or
 * filter by rating, so the 5-star filter is applied here. Querying both
 * clinics gives up to 10 candidates before filtering.
 */

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

/** Place IDs (ChIJ… format). CIDs from Maps URLs will not work here. */
const PLACE_IDS = [
  process.env.GOOGLE_PLACE_ID_IRVING,
  process.env.GOOGLE_PLACE_ID_CELINA,
].filter((id): id is string => Boolean(id && id.trim()));

export const revalidate = 86400;

interface PlacesReview {
  author_name?: string;
  rating?: number;
  text?: string;
  author_url?: string;
  time?: number;
  profile_photo_url?: string;
}

export interface ApiReview {
  id: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  link: string;
  photo?: string;
}

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

async function fetchPlace(placeId: string): Promise<PlacesReview[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'reviews');
  url.searchParams.set('reviews_sort', 'most_relevant');
  url.searchParams.set('key', API_KEY as string);

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) return [];

  const json = await res.json();
  // Places signals failures in the body, not the HTTP status.
  if (json.status && json.status !== 'OK') {
    console.error('Places API error:', json.status, json.error_message ?? '');
    return [];
  }
  return Array.isArray(json.result?.reviews) ? json.result.reviews : [];
}

export async function GET() {
  // Without credentials the carousel keeps its curated reviews, so an
  // empty list here is a valid, non-error state.
  if (!API_KEY || PLACE_IDS.length === 0) {
    return NextResponse.json({ reviews: [], configured: false });
  }

  try {
    const batches = await Promise.all(
      PLACE_IDS.map((id) => fetchPlace(id).catch(() => []))
    );

    const reviews: ApiReview[] = batches
      .flat()
      // Only 5-star reviews, per the brief.
      .filter((r) => r.rating === 5 && (r.text ?? '').trim().length > 0)
      .map((r, i) => {
        const name = (r.author_name ?? 'Google User').trim();
        return {
          id: `g-${r.time ?? i}-${i}`,
          name,
          initials: initialsFrom(name) || 'G',
          rating: 5,
          text: (r.text ?? '').trim(),
          link: r.author_url ?? '',
          photo: r.profile_photo_url,
        };
      })
      // Longest first: a one-word review reads as filler in a card.
      .sort((a, b) => b.text.length - a.text.length);

    return NextResponse.json({ reviews, configured: true });
  } catch (error) {
    console.error('Failed to load Google reviews:', error);
    return NextResponse.json({ reviews: [], configured: true });
  }
}
