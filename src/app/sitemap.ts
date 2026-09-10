import type { MetadataRoute } from 'next';
import { getPublicDoctors, getPublicServices, getPublicBlogPosts } from './lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tppcare.com';

// Re-generate hourly so new CMS content appears without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/locations`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/providers`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
  ];

  // A CMS outage must not fail the build, so each list degrades to empty.
  const [services, doctors, posts] = await Promise.all([
    getPublicServices().catch(() => []),
    getPublicDoctors().catch(() => []),
    getPublicBlogPosts().catch(() => []),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s) => s.slug)
    .map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const doctorRoutes: MetadataRoute.Sitemap = doctors
    .filter((d) => d.slug)
    .map((d) => ({
      url: `${SITE_URL}/providers/${d.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...serviceRoutes, ...doctorRoutes, ...postRoutes];
}
