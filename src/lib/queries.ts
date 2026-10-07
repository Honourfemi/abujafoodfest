/**
 * Query helpers — all async against PostgreSQL.
 */
import { queryAll, queryOne } from "./db";
import type {
  Event,
  GalleryItem,
  VendorPricing,
  PartnerPricing,
  TicketOrder,
  VendorBooking,
} from "@/types";

/** Coerce pg row dates/numerics for RSC serialization */
function mapEvent(r: Event): Event {
  return { ...r, created_at: String(r.created_at), updated_at: String(r.updated_at) };
}
function mapGallery(r: GalleryItem): GalleryItem {
  return { ...r, created_at: String(r.created_at) };
}
function mapOrder(r: TicketOrder): TicketOrder {
  return {
    ...r,
    total: Number(r.total),
    qty: Number(r.qty),
    created_at: String(r.created_at),
    payment_status: (r.payment_status || "pending") as TicketOrder["payment_status"],
  };
}
function mapBooking(r: VendorBooking): VendorBooking {
  return {
    ...r,
    total: Number(r.total),
    qty: Number(r.qty),
    created_at: String(r.created_at),
    payment_status: (r.payment_status || "pending") as VendorBooking["payment_status"],
  };
}

/* ---------- Events ---------- */

export async function getAllEvents(): Promise<Event[]> {
  return (await queryAll<Event>("SELECT * FROM events ORDER BY created_at")).map(mapEvent);
}

export async function getEventById(id: string): Promise<Event | undefined> {
  const row = await queryOne<Event>("SELECT * FROM events WHERE id = $1", [id]);
  return row ? mapEvent(row) : undefined;
}

/* ---------- Gallery ---------- */

export async function getGallery(category?: string): Promise<GalleryItem[]> {
  if (category && category !== "all") {
    return (await queryAll<GalleryItem>(
      "SELECT * FROM gallery WHERE category = $1 ORDER BY created_at DESC",
      [category]
    )).map(mapGallery);
  }
  return (await queryAll<GalleryItem>("SELECT * FROM gallery ORDER BY created_at DESC")).map(mapGallery);
}

/* ---------- Pricing ---------- */

export async function getVendorPricing(): Promise<VendorPricing> {
  const row = await queryOne<VendorPricing>(
    "SELECT single, multi, flagship FROM vendor_pricing WHERE id = 1"
  );
  return row ?? { single: 25000, multi: 20000, flagship: 45000 };
}

export async function getPartnerPricing(): Promise<PartnerPricing> {
  const row = await queryOne<PartnerPricing>(
    "SELECT community, festival, title FROM partner_pricing WHERE id = 1"
  );
  return row ?? { community: 150000, festival: 500000, title: "Custom" };
}

/* ---------- Ticket orders (admin) ---------- */

export async function getAllTicketOrders(): Promise<TicketOrder[]> {
  return (await queryAll<TicketOrder>("SELECT * FROM ticket_orders ORDER BY created_at DESC")).map(mapOrder);
}

export async function getTicketOrderStats(): Promise<{
  count: number;
  tickets: number;
  revenue: number;
}> {
  const row = await queryOne<{ count: string; tickets: string; revenue: string }>(
    `SELECT COUNT(*)::text as count,
            COALESCE(SUM(qty), 0)::text as tickets,
            COALESCE(SUM(total), 0)::text as revenue
     FROM ticket_orders
     WHERE payment_status = 'paid' OR payment_status = 'pending'`
  );
  return {
    count: Number(row?.count ?? 0),
    tickets: Number(row?.tickets ?? 0),
    revenue: Number(row?.revenue ?? 0),
  };
}

/* ---------- Vendor bookings (admin) ---------- */

export async function getAllVendorBookings(): Promise<VendorBooking[]> {
  return (await queryAll<VendorBooking>("SELECT * FROM vendor_bookings ORDER BY created_at DESC")).map(mapBooking);
}

export async function getVendorBookingStats(): Promise<{
  bookings: number;
  stalls: number;
  revenue: number;
  businesses: number;
}> {
  const row = await queryOne<{
    bookings: string;
    stalls: string;
    revenue: string;
    businesses: string;
  }>(
    `SELECT COUNT(*)::text as bookings,
            COALESCE(SUM(qty), 0)::text as stalls,
            COALESCE(SUM(total), 0)::text as revenue,
            COUNT(DISTINCT LOWER(business))::text as businesses
     FROM vendor_bookings`
  );
  return {
    bookings: Number(row?.bookings ?? 0),
    stalls: Number(row?.stalls ?? 0),
    revenue: Number(row?.revenue ?? 0),
    businesses: Number(row?.businesses ?? 0),
  };
}

/* ---------- Contact & newsletter (admin) ---------- */

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  enquiry_type: string;
  created_at: string;
};

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  return queryAll<ContactMessage>(
    "SELECT * FROM contact_messages ORDER BY created_at DESC"
  );
}

export async function getNewsletterCount(): Promise<number> {
  const row = await queryOne<{ c: string }>(
    "SELECT COUNT(*)::text as c FROM newsletter_subscribers"
  );
  return Number(row?.c ?? 0);
}

export async function getOverviewStats() {
  const tickets = await getTicketOrderStats();
  const vendors = await getVendorBookingStats();
  const events = await queryOne<{ c: string }>("SELECT COUNT(*)::text as c FROM events");
  const gallery = await queryOne<{ c: string }>("SELECT COUNT(*)::text as c FROM gallery");
  return {
    ticketOrders: tickets.count,
    ticketsSold: tickets.tickets,
    ticketRevenue: tickets.revenue,
    vendorBookings: vendors.bookings,
    vendorStalls: vendors.stalls,
    vendorRevenue: vendors.revenue,
    vendorBusinesses: vendors.businesses,
    events: Number(events?.c ?? 0),
    gallery: Number(gallery?.c ?? 0),
    newsletter: await getNewsletterCount(),
  };
}
