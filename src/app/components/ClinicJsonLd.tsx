const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tppcare.com';

const PHONE = '+1-469-442-0202';
const FAX = '+1-469-372-6188';
const EMAIL = 'admin@tppcare.com';

/**
 * Structured data for both clinics.
 *
 * MedicalClinic is what lets Google show hours, a call button and a map
 * pin in the search result rather than a plain link. Hours mirror the
 * values shown on /locations; keep the two in step.
 */
const CLINICS = [
  {
    id: `${SITE_URL}/#clinic-irving`,
    name: 'Texas Primary & Pediatric Care — Irving',
    street: '7429 Las Colinas Blvd, Ste 101',
    city: 'Irving',
    zip: '75063',
    lat: 32.908927,
    lng: -96.954422,
    hours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '08:30', close: '19:00' },
      { days: ['Saturday'], open: '10:00', close: '15:30' },
    ],
  },
  {
    id: `${SITE_URL}/#clinic-celina`,
    name: 'Texas Primary & Pediatric Care — Celina',
    street: '3925 S Preston Rd, Ste 100',
    city: 'Celina',
    zip: '75009',
    lat: 33.270973,
    lng: -96.785839,
    hours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '08:30', close: '17:30' },
    ],
  },
];

export default function ClinicJsonLd() {
  const graph = [
    {
      '@type': 'MedicalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Texas Primary & Pediatric Care',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      telephone: PHONE,
      faxNumber: FAX,
      email: EMAIL,
      medicalSpecialty: ['PrimaryCare', 'Pediatric'],
      department: CLINICS.map((c) => ({ '@id': c.id })),
    },
    ...CLINICS.map((c) => ({
      '@type': 'MedicalClinic',
      '@id': c.id,
      name: c.name,
      url: `${SITE_URL}/locations`,
      telephone: PHONE,
      faxNumber: FAX,
      email: EMAIL,
      image: `${SITE_URL}/logo.png`,
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.street,
        addressLocality: c.city,
        addressRegion: 'TX',
        postalCode: c.zip,
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: c.lat,
        longitude: c.lng,
      },
      openingHoursSpecification: c.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.open,
        closes: h.close,
      })),
      isAcceptingNewPatients: true,
    })),
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Texas Primary & Pediatric Care',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
