/**
 * Resolve the clinic Place IDs (ChIJ… format) needed by /api/reviews.
 *
 * Usage:  GOOGLE_PLACES_API_KEY=AIza... node find-place-ids.cjs
 *
 * Uses Find Place, which is a cheaper SKU than Place Details. Prints
 * the two env lines to paste into .env.
 */
const KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!KEY) {
  console.error('Set GOOGLE_PLACES_API_KEY first. Example:');
  console.error('  GOOGLE_PLACES_API_KEY=AIza... node find-place-ids.cjs');
  process.exit(1);
}

const CLINICS = [
  { env: 'GOOGLE_PLACE_ID_IRVING', q: 'Texas Primary & Pediatric Care, 7429 Las Colinas Blvd Ste 101, Irving, TX 75063' },
  { env: 'GOOGLE_PLACE_ID_CELINA', q: 'Texas Primary & Pediatric Care, 3925 S Preston Rd Ste 100, Celina, TX 75009' },
];

(async () => {
  for (const c of CLINICS) {
    const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
    url.searchParams.set('input', c.q);
    url.searchParams.set('inputtype', 'textquery');
    url.searchParams.set('fields', 'place_id,name,formatted_address');
    url.searchParams.set('key', KEY);

    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== 'OK' || !json.candidates?.length) {
      console.error(`\n${c.env}: FAILED (${json.status})`, json.error_message ?? '');
      continue;
    }
    const top = json.candidates[0];
    console.log(`\n${top.name} — ${top.formatted_address}`);
    console.log(`${c.env}=${top.place_id}`);
  }
})();
