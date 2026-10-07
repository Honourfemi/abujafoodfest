/**
 * Seed PostgreSQL with default data from original HTML.
 * Run: npm run db:seed  (or npm run db:reset)
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import bcrypt from "bcryptjs";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set. See .env.example");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
      : undefined,
});

const defaultEvents = [
  {
    id: "ev-campus-tour",
    badge: "Campus Tour",
    date: "📅 7–28 Nov 2026",
    location: "📍 5 Campuses",
    title: "Abuja Food Fest — Campus Tour",
    description:
      "Food stalls, music and student vibes touching down at 5 universities this November.",
    price: "Free entry",
    image_url:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "ev-december",
    badge: "Flagship",
    date: "📅 Dec 13, 2026",
    location: "📍 Jabi Lake, Abuja",
    title: "Abuja Food Fest — December Edition",
    description:
      "The year's biggest edition: 60+ vendors, live performances, brand activations and the city's best food all weekend.",
    price: "From ₦5,000",
    image_url:
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "ev-night-market",
    badge: "Night Market",
    date: "📅 Oct 24, 2026",
    location: "📍 Wuse, Abuja",
    title: "AFF Night Market",
    description:
      "An evening street-food crawl with live DJ sets, small-chops vendors and pop-up brand booths.",
    price: "From ₦2,500",
    image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "ev-taste-sound",
    badge: "Live Music",
    date: "📅 Jan 17, 2027",
    location: "📍 Maitama, Abuja",
    title: "Taste & Sound Sessions",
    description:
      "An intimate food-and-live-band evening pairing local dishes with rising Nigerian artists.",
    price: "From ₦4,000",
    image_url:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "ev-grill-popup",
    badge: "Pop-Up",
    date: "📅 Feb 21, 2027",
    location: "📍 Gwarinpa, Abuja",
    title: "Weekend Grill Pop-Up",
    description:
      "A relaxed Saturday grill-focused pop-up with family activities and live cooking demos.",
    price: "From ₦1,500",
    image_url:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: "ev-anniversary",
    badge: "Anniversary",
    date: "📅 Mar 2027",
    location: "📍 TBA",
    title: "AFF 4th Anniversary Festival",
    description:
      "Celebrating four years of Abuja Food Fest with our biggest vendor lineup yet.",
    price: "TBA",
    image_url:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=700&auto=format&fit=crop",
  },
];

const defaultGallery = [
  { id: "g1", category: "food", src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop", alt: "Grilled food closeup" },
  { id: "g2", category: "events", src: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=500&auto=format&fit=crop", alt: "Festival grounds overview" },
  { id: "g3", category: "entertainment", src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=500&auto=format&fit=crop", alt: "Live band performance" },
  { id: "g4", category: "vendors", src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500&auto=format&fit=crop", alt: "Vendor stall closeup" },
  { id: "g5", category: "events", src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=500&auto=format&fit=crop", alt: "Crowd dancing at festival" },
  { id: "g6", category: "food", src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500&auto=format&fit=crop", alt: "Attendees enjoying food" },
  { id: "g7", category: "vendors", src: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=500&auto=format&fit=crop", alt: "Vendor serving customers" },
  { id: "g8", category: "brand", src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=500&auto=format&fit=crop", alt: "Brand activation booth" },
  { id: "g9", category: "entertainment", src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=500&auto=format&fit=crop", alt: "DJ set at festival" },
  { id: "g10", category: "food", src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop", alt: "Street food plate" },
  { id: "g11", category: "events", src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=500&auto=format&fit=crop", alt: "Festival at sunset" },
  { id: "g12", category: "brand", src: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=500&auto=format&fit=crop", alt: "Brand sampling station" },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      DELETE FROM events;
      DELETE FROM gallery;
      DELETE FROM vendor_pricing;
      DELETE FROM partner_pricing;
      DELETE FROM admin_users;
    `);

    for (const ev of defaultEvents) {
      await client.query(
        `INSERT INTO events (id, badge, date, location, title, description, price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [ev.id, ev.badge, ev.date, ev.location, ev.title, ev.description, ev.price, ev.image_url]
      );
    }

    for (const g of defaultGallery) {
      await client.query(
        `INSERT INTO gallery (id, category, src, alt) VALUES ($1, $2, $3, $4)`,
        [g.id, g.category, g.src, g.alt]
      );
    }

    await client.query(
      `INSERT INTO vendor_pricing (id, single, multi, flagship) VALUES (1, 25000, 20000, 45000)`
    );
    await client.query(
      `INSERT INTO partner_pricing (id, community, festival, title) VALUES (1, 150000, 500000, 'Custom')`
    );

    const hash = bcrypt.hashSync("admin123", 10);
    await client.query(
      `INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)`,
      ["admin@abujafoodfest.com", hash]
    );

    await client.query("COMMIT");

    console.log("✅ Seed completed successfully");
    console.log(`   • ${defaultEvents.length} events`);
    console.log(`   • ${defaultGallery.length} gallery images`);
    console.log(`   • Vendor pricing: ₦25k / ₦20k / ₦45k`);
    console.log(`   • Partner pricing: ₦150k / ₦500k / Custom`);
    console.log(`   • Admin user: admin@abujafoodfest.com / admin123`);
    console.log("");
    console.log("⚠️  Change the admin password after first login in production!");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ seed failed:", e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
