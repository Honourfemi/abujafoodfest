/**
 * Create PostgreSQL schema for Abuja Food Fest.
 * Run: npm run db:init
 * Requires DATABASE_URL in env (or .env.local).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

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

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      DROP TABLE IF EXISTS contact_messages CASCADE;
      DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
      DROP TABLE IF EXISTS admin_users CASCADE;
      DROP TABLE IF EXISTS partner_pricing CASCADE;
      DROP TABLE IF EXISTS vendor_pricing CASCADE;
      DROP TABLE IF EXISTS vendor_bookings CASCADE;
      DROP TABLE IF EXISTS ticket_orders CASCADE;
      DROP TABLE IF EXISTS gallery CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
    `);

    await client.query(`
      CREATE TABLE events (
        id          TEXT PRIMARY KEY,
        badge       TEXT NOT NULL DEFAULT 'Event',
        date        TEXT NOT NULL,
        location    TEXT NOT NULL,
        title       TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        price       TEXT NOT NULL DEFAULT 'TBA',
        image_url   TEXT NOT NULL DEFAULT '',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE gallery (
        id          TEXT PRIMARY KEY,
        category    TEXT NOT NULL CHECK (category IN ('food','events','entertainment','vendors','brand')),
        src         TEXT NOT NULL,
        alt         TEXT NOT NULL DEFAULT '',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE ticket_orders (
        id                  TEXT PRIMARY KEY,
        name                TEXT NOT NULL,
        email               TEXT NOT NULL,
        phone               TEXT,
        event_name          TEXT NOT NULL,
        tickets_json        TEXT NOT NULL DEFAULT '[]',
        qty                 INTEGER NOT NULL DEFAULT 0,
        total               NUMERIC(12,2) NOT NULL DEFAULT 0,
        payment_status      TEXT NOT NULL DEFAULT 'pending'
                            CHECK (payment_status IN ('pending','paid','failed','refunded')),
        paystack_reference  TEXT,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE vendor_bookings (
        id                  TEXT PRIMARY KEY,
        business            TEXT NOT NULL,
        category            TEXT NOT NULL DEFAULT '',
        contact             TEXT NOT NULL,
        phone               TEXT,
        email               TEXT NOT NULL,
        instagram           TEXT,
        package             TEXT NOT NULL,
        qty                 INTEGER NOT NULL DEFAULT 1,
        dates               TEXT,
        total               NUMERIC(12,2) NOT NULL DEFAULT 0,
        payment_status      TEXT NOT NULL DEFAULT 'pending'
                            CHECK (payment_status IN ('pending','paid','failed','refunded')),
        paystack_reference  TEXT,
        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE vendor_pricing (
        id        INTEGER PRIMARY KEY CHECK (id = 1),
        single    INTEGER NOT NULL DEFAULT 25000,
        multi     INTEGER NOT NULL DEFAULT 20000,
        flagship  INTEGER NOT NULL DEFAULT 45000
      );

      CREATE TABLE partner_pricing (
        id         INTEGER PRIMARY KEY CHECK (id = 1),
        community  INTEGER NOT NULL DEFAULT 150000,
        festival   INTEGER NOT NULL DEFAULT 500000,
        title      TEXT NOT NULL DEFAULT 'Custom'
      );

      CREATE TABLE admin_users (
        id            SERIAL PRIMARY KEY,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE newsletter_subscribers (
        id         SERIAL PRIMARY KEY,
        email      TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE contact_messages (
        id           SERIAL PRIMARY KEY,
        name         TEXT NOT NULL,
        email        TEXT NOT NULL,
        subject      TEXT,
        message      TEXT NOT NULL,
        enquiry_type TEXT DEFAULT 'general',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX idx_ticket_orders_email ON ticket_orders (email);
      CREATE INDEX idx_ticket_orders_status ON ticket_orders (payment_status);
      CREATE INDEX idx_vendor_bookings_email ON vendor_bookings (email);
      CREATE INDEX idx_gallery_category ON gallery (category);
    `);

    await client.query("COMMIT");
    console.log("✅ PostgreSQL schema created successfully.");
    console.log("Tables: events, gallery, ticket_orders, vendor_bookings,");
    console.log("        vendor_pricing, partner_pricing, admin_users,");
    console.log("        newsletter_subscribers, contact_messages");
    console.log("Payment columns: payment_status, paystack_reference on orders/bookings");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ init-db failed:", e);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
