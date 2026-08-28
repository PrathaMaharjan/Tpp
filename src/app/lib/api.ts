import axios from "axios";

const POS_URL = (process.env.NEXT_PUBLIC_POS_API_URL || "http://localhost:3000").replace(/\/$/, "");
const DEFAULT_TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG?.trim() || "tpp";

export const posApi = axios.create({
  baseURL: POS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Fetch Outlets / Locations for a Tenant
export const getPublicLocations = (tenantSlug: string = DEFAULT_TENANT_SLUG) =>
  posApi.get("/api/public/locations", {
    params: { tenantSlug },
  });

// 2. Fetch Doctors (filtered by Outlet locationId and/or tenantSlug)
export const getPublicDoctors = (params?: { locationId?: string; tenantSlug?: string }) =>
  posApi.get("/api/public/doctors", {
    params: {
      tenantSlug: params?.tenantSlug || DEFAULT_TENANT_SLUG,
      locationId: params?.locationId,
    },
  });

// 3. Fetch Services / Treatments (filtered by Outlet locationId and/or tenantSlug)
export const getPublicServices = (params?: { locationId?: string; tenantSlug?: string }) =>
  posApi.get("/api/public/treatments", {
    params: {
      tenantSlug: params?.tenantSlug || DEFAULT_TENANT_SLUG,
      locationId: params?.locationId,
    },
  });

// 4. Submit Online Booking
export const submitAppointmentBooking = (bookingPayload: {
  fullName: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  serviceName?: string;
  dentistName?: string;
  tenantSlug?: string;
  locationId?: string;
  notes?: string;
  source?: string;
}) =>
  posApi.post("/api/public/booking", {
    tenantSlug: DEFAULT_TENANT_SLUG,
    ...bookingPayload,
  });

// 5. Utility helper to create SEO-friendly clean URL slugs from names
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
