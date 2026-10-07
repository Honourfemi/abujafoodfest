"use server";

import { query, queryOne } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  createSessionCookie,
  requireAdmin,
  verifyAdminCredentials,
} from "./auth";
import { deleteLocalUpload, saveUploadedImage } from "./uploads";

export type ActionResult =
  | { ok: true; id?: string | number; message?: string; authorization_url?: string }
  | { ok: false; error: string };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ============================================================
   PUBLIC FORM ACTIONS
============================================================ */

export async function createTicketOrder(input: {
  name: string;
  email: string;
  phone?: string;
  eventName: string;
  tickets: { name: string; qty: number; price: number }[];
  total: number;
}): Promise<ActionResult> {
  try {
    const name = (input.name || "").trim();
    const email = (input.email || "").trim().toLowerCase();
    const phone = (input.phone || "").trim() || null;
    const eventName = (input.eventName || "").trim();
    const tickets = Array.isArray(input.tickets) ? input.tickets : [];
    const total = Number(input.total) || 0;

    if (!name || !email) return { ok: false, error: "Name and email are required." };
    if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." };
    if (!eventName) return { ok: false, error: "Please select an event." };
    if (!tickets.length || tickets.every((t) => !t.qty || t.qty <= 0)) {
      return { ok: false, error: "Please select at least one ticket." };
    }
    if (total <= 0) return { ok: false, error: "Invalid order total." };

    const qty = tickets.reduce((s, t) => s + (Number(t.qty) || 0), 0);
    const ticketsJson = JSON.stringify(
      tickets.filter((t) => t.qty > 0).map((t) => ({ name: t.name, qty: t.qty, price: t.price }))
    );
    const id = genId("ord");

    await query(
      `INSERT INTO ticket_orders (id, name, email, phone, event_name, tickets_json, qty, total, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
      [id, name, email, phone, eventName, ticketsJson, qty, total]
    );

    revalidatePath("/tickets");
    revalidatePath("/admin/orders");
    return {
      ok: true,
      id,
      message:
        "Order recorded. Complete payment with Paystack when keys are configured (see README).",
    };
  } catch (e) {
    console.error("createTicketOrder", e);
    return { ok: false, error: "Could not save your order. Please try again." };
  }
}

export async function createVendorBooking(input: {
  business: string;
  category: string;
  contact: string;
  phone?: string;
  email: string;
  instagram?: string;
  package: string;
  qty: number;
  dates?: string;
  total: number;
}): Promise<ActionResult> {
  try {
    const business = (input.business || "").trim();
    const category = (input.category || "").trim();
    const contact = (input.contact || "").trim();
    const phone = (input.phone || "").trim() || null;
    const email = (input.email || "").trim().toLowerCase();
    const instagram = (input.instagram || "").trim() || null;
    const pkg = (input.package || "").trim();
    const qty = Math.max(1, Number(input.qty) || 1);
    const dates = (input.dates || "").trim() || null;
    const total = Number(input.total) || 0;

    if (!business || !contact || !email) {
      return { ok: false, error: "Business name, contact name and email are required." };
    }
    if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." };
    if (!pkg) return { ok: false, error: "Please select a package." };
    if (total <= 0) return { ok: false, error: "Invalid booking total." };

    const id = genId("vb");

    await query(
      `INSERT INTO vendor_bookings
       (id, business, category, contact, phone, email, instagram, package, qty, dates, total, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')`,
      [id, business, category, contact, phone, email, instagram, pkg, qty, dates, total]
    );

    revalidatePath("/vendor");
    revalidatePath("/admin/vendors");
    return {
      ok: true,
      id,
      message: "Vendor booking received. Payment status: pending.",
    };
  } catch (e) {
    console.error("createVendorBooking", e);
    return { ok: false, error: "Could not save your booking. Please try again." };
  }
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  enquiryType?: string;
}): Promise<ActionResult> {
  try {
    const name = (input.name || "").trim();
    const email = (input.email || "").trim().toLowerCase();
    const subject = (input.subject || "").trim() || null;
    const message = (input.message || "").trim();
    const enquiryType = (input.enquiryType || "general").trim().toLowerCase();

    if (!name || !email) return { ok: false, error: "Name and email are required." };
    if (!isValidEmail(email)) return { ok: false, error: "Please enter a valid email address." };
    if (!message) return { ok: false, error: "Please enter a message." };

    const result = await query(
      `INSERT INTO contact_messages (name, email, subject, message, enquiry_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, email, subject, message, enquiryType]
    );

    revalidatePath("/contact");
    revalidatePath("/partnership");
    return {
      ok: true,
      id: result.rows[0]?.id as number,
      message: "Message received.",
    };
  } catch (e) {
    console.error("createContactMessage", e);
    return { ok: false, error: "Could not send your message. Please try again." };
  }
}

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  try {
    const cleaned = (email || "").trim().toLowerCase();
    if (!cleaned) return { ok: false, error: "Email is required." };
    if (!isValidEmail(cleaned)) return { ok: false, error: "Please enter a valid email address." };

    try {
      await query(`INSERT INTO newsletter_subscribers (email) VALUES ($1)`, [cleaned]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("unique") || msg.includes("duplicate") || msg.includes("23505")) {
        return { ok: true, message: "You're already on the list." };
      }
      throw err;
    }

    return { ok: true, message: "Subscribed successfully." };
  } catch (e) {
    console.error("subscribeNewsletter", e);
    return { ok: false, error: "Could not subscribe. Please try again." };
  }
}

/* ============================================================
   AUTH
============================================================ */

export async function adminLogin(email: string, password: string): Promise<ActionResult> {
  try {
    const user = await verifyAdminCredentials(email, password);
    if (!user) return { ok: false, error: "Invalid email or password." };
    await createSessionCookie(user.email);
    return { ok: true, message: "Logged in." };
  } catch (e) {
    console.error("adminLogin", e);
    return { ok: false, error: "Login failed. Please try again." };
  }
}

export async function adminLogout(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ============================================================
   ADMIN MUTATIONS
============================================================ */

export async function createEvent(input: {
  id?: string;
  badge: string;
  date: string;
  location: string;
  title: string;
  description: string;
  price: string;
  image_url: string;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const title = (input.title || "").trim();
    const date = (input.date || "").trim();
    const location = (input.location || "").trim();
    if (!title || !date || !location) {
      return { ok: false, error: "Title, date and location are required." };
    }

    const id = (input.id || "").trim() || genId("ev");
    const badge = (input.badge || "Event").trim();
    const description = (input.description || "").trim() || "More details coming soon.";
    const price = (input.price || "TBA").trim();
    const image_url =
      (input.image_url || "").trim() ||
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=700&auto=format&fit=crop";

    await query(
      `INSERT INTO events (id, badge, date, location, title, description, price, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, badge, date, location, title, description, price, image_url]
    );

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/admin/events");
    return { ok: true, id };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("createEvent", e);
    return { ok: false, error: "Could not create event." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!id) return { ok: false, error: "Event id required." };

    const row = await queryOne<{ image_url: string }>(
      "SELECT image_url FROM events WHERE id = $1",
      [id]
    );

    await query("DELETE FROM events WHERE id = $1", [id]);

    if (row?.image_url) {
      deleteLocalUpload(row.image_url);
    }

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("deleteEvent", e);
    return { ok: false, error: "Could not delete event." };
  }
}

export async function createGalleryItem(input: {
  id?: string;
  category: string;
  src: string;
  alt?: string;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const category = (input.category || "events").trim();
    const src = (input.src || "").trim();
    const alt = (input.alt || "").trim() || "Abuja Food Fest photo";
    if (!src) return { ok: false, error: "Image source is required." };

    const id = (input.id || "").trim() || genId("g");
    await query(`INSERT INTO gallery (id, category, src, alt) VALUES ($1, $2, $3, $4)`, [
      id,
      category,
      src,
      alt,
    ]);

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true, id };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("createGalleryItem", e);
    return { ok: false, error: "Could not add gallery item." };
  }
}

export async function uploadGalleryImage(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const category = String(formData.get("category") || "events").trim();
    const alt = String(formData.get("alt") || "").trim() || "Abuja Food Fest photo";
    const urlSrc = String(formData.get("src") || "").trim();
    const file = formData.get("file");

    let src = urlSrc;

    if (file instanceof File && file.size > 0) {
      const saved = await saveUploadedImage(file);
      if (!saved.ok) return { ok: false, error: saved.error };
      src = saved.publicPath;
    }

    if (!src) {
      return { ok: false, error: "Please choose an image file or enter an image URL." };
    }

    const id = genId("g");
    await query(`INSERT INTO gallery (id, category, src, alt) VALUES ($1, $2, $3, $4)`, [
      id,
      category,
      src,
      alt,
    ]);

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true, id, message: "Image added to gallery." };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("uploadGalleryImage", e);
    return { ok: false, error: "Could not upload gallery image." };
  }
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!id) return { ok: false, error: "Gallery id required." };

    const row = await queryOne<{ src: string }>("SELECT src FROM gallery WHERE id = $1", [id]);

    await query("DELETE FROM gallery WHERE id = $1", [id]);

    if (row?.src) {
      deleteLocalUpload(row.src);
    }

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("deleteGalleryItem", e);
    return { ok: false, error: "Could not delete gallery item." };
  }
}

export async function createEventWithUpload(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const title = String(formData.get("title") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const location = String(formData.get("location") || "").trim();
    if (!title || !date || !location) {
      return { ok: false, error: "Title, date and location are required." };
    }

    const badge = String(formData.get("badge") || "Event").trim() || "Event";
    const description =
      String(formData.get("description") || "").trim() || "More details coming soon.";
    const price = String(formData.get("price") || "TBA").trim() || "TBA";
    let image_url = String(formData.get("image_url") || "").trim();

    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      const saved = await saveUploadedImage(file);
      if (!saved.ok) return { ok: false, error: saved.error };
      image_url = saved.publicPath;
    }

    if (!image_url) {
      image_url =
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=700&auto=format&fit=crop";
    }

    const id = genId("ev");
    await query(
      `INSERT INTO events (id, badge, date, location, title, description, price, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, badge, date, location, title, description, price, image_url]
    );

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${id}`);
    revalidatePath("/admin/events");
    return { ok: true, id };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("createEventWithUpload", e);
    return { ok: false, error: "Could not create event." };
  }
}

export async function updateVendorPricing(input: {
  single: number;
  multi: number;
  flagship: number;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const single = Math.max(0, Number(input.single) || 0);
    const multi = Math.max(0, Number(input.multi) || 0);
    const flagship = Math.max(0, Number(input.flagship) || 0);

    await query(
      `UPDATE vendor_pricing SET single = $1, multi = $2, flagship = $3 WHERE id = 1`,
      [single, multi, flagship]
    );

    revalidatePath("/vendor");
    revalidatePath("/events");
    revalidatePath("/admin/pricing");
    return { ok: true, message: "Vendor pricing updated." };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("updateVendorPricing", e);
    return { ok: false, error: "Could not update vendor pricing." };
  }
}

export async function updatePartnerPricing(input: {
  community: number;
  festival: number;
  title: string;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const community = Math.max(0, Number(input.community) || 0);
    const festival = Math.max(0, Number(input.festival) || 0);
    const title = (input.title || "Custom").trim() || "Custom";

    await query(
      `UPDATE partner_pricing SET community = $1, festival = $2, title = $3 WHERE id = 1`,
      [community, festival, title]
    );

    revalidatePath("/partnership");
    revalidatePath("/admin/pricing");
    return { ok: true, message: "Partner pricing updated." };
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") return { ok: false, error: "Unauthorized." };
    console.error("updatePartnerPricing", e);
    return { ok: false, error: "Could not update partner pricing." };
  }
}
