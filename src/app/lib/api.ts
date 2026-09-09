const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";
const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG || "tpp";


/**
 * The CMS is inconsistent about envelopes: /doctors and /treatments
 * return a bare array, while /blog-posts and /blog-categories return
 * `{ data: [...] }`. Accept either rather than silently returning [].
 */
function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const inner = (payload as { data?: unknown }).data;
    if (Array.isArray(inner)) return inner as T[];
  }
  return [];
}

// ── Types ────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  specialty?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  authorName?: string | null;
  authorImage?: string | null;
  status?: "draft" | "published" | null;
  publishedAt?: string | null;
  createdAt?: string | null;
}

export interface Service {
  id: string;
  title: string;
  name: string; // alias so item.title and item.name both work
  slug: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  isActive?: boolean | null;
  createdAt?: string | null;
}

export type Treatment = Service;

// ── Doctors API ──────────────────────────────────────────────────

export async function getPublicDoctors(): Promise<Doctor[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/doctors`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const docs = unwrapList<Doctor>(await res.json());
    return docs.filter((d) => d.isActive !== false);
  } catch (error) {
    console.error("Error in getPublicDoctors:", error);
    return [];
  }
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/doctors/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error in getDoctorBySlug:", error);
    return null;
  }
}

// ── Blog Posts API ───────────────────────────────────────────────

export async function getPublicBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/blog-posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const posts = unwrapList<BlogPost>(await res.json());
    // Some CMS list responses omit `status`; only exclude posts that are
    // explicitly not published rather than requiring the field.
    return posts.filter((p) => !p.status || p.status === "published");
  } catch (error) {
    console.error("Error in getPublicBlogPosts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/blog-posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error);
    return null;
  }
}

// ── Services / Treatments API ────────────────────────────────────

export async function getPublicServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/treatments`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = unwrapList<Service>(await res.json());

    return data
      .filter((item) => item.isActive !== false)
      .map((item) => ({
        ...item,
        name: item.title || item.name,
      }));
  } catch (error) {
    console.error("Error in getPublicServices:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/${SITE_SLUG}/treatments/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const item = await res.json();
    return {
      ...item,
      name: item.title || item.name,
    };
  } catch (error) {
    console.error("Error in getServiceBySlug:", error);
    return null;
  }
}

export const getPublicTreatments = getPublicServices;
export const getTreatmentBySlug = getServiceBySlug;

// ── Utility ──────────────────────────────────────────────────────

export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
