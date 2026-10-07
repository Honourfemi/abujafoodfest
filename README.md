# Abuja Food Fest — Next.js + PostgreSQL

**Phases 0–6 complete.**

Full-stack conversion of the original single-file HTML SPA into Next.js with **PostgreSQL**, public pages, server actions, secured admin dashboard, file uploads, and Paystack-ready payment scaffolding.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Database | **PostgreSQL** via `pg` |
| Auth | bcrypt + HMAC-signed HTTP-only cookie |
| Uploads | Local `public/uploads` (Phase 5) |
| Payments | Paystack helpers ready (`src/lib/paystack.ts`) |

## What's included

| Phase | Item | Status |
|-------|------|--------|
| 0–2 | App, schema, seed, public pages | done |
| 3 | Server Actions for public forms | done |
| 4 | Admin login + dashboard | done |
| 5 | Gallery & event image uploads | done |
| **6** | **PostgreSQL migration** | **done** |
| **6** | **Payment status + Paystack scaffolding** | **done** |
| **6** | **Polish (fake card fields removed, async queries, type coercion)** | **done** |

## Database (PostgreSQL)

```bash
# 1. Create a database (local example)
createdb abuja_food_fest

# 2. Configure env
cp .env.example .env.local
# Edit DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/abuja_food_fest

# 3. Schema + seed
npm install
npm run db:reset

# 4. Run
npm run dev
```

Managed hosts (Neon, Supabase, Railway): set `DATABASE_URL` and usually `DATABASE_SSL=true`.

### Tables

`events`, `gallery`, `ticket_orders`, `vendor_bookings`, `vendor_pricing`, `partner_pricing`, `admin_users`, `newsletter_subscribers`, `contact_messages`

**Payment columns** on `ticket_orders` and `vendor_bookings`:

- `payment_status` — `pending` | `paid` | `failed` | `refunded` (default `pending`)
- `paystack_reference` — filled when Paystack is wired

## Paystack

There was **no live Paystack integration** in the original HTML — only UI chips (Card / Bank / USSD) and a fake card form.

What Phase 6 provides:

1. **`src/lib/paystack.ts`** — `initializeTransaction` / `verifyTransaction` / `isPaystackConfigured`
2. Orders & bookings saved with `payment_status = 'pending'`
3. Ticket UI updated: no fake card inputs; shows Paystack-ready messaging
4. Admin tables show payment status badges + CSV columns

**To go live:**

1. Get keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developers)
2. Set in `.env.local`:
   ```
   PAYSTACK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
   ```
3. Call `initializeTransaction` from the ticket/vendor submit flow and redirect to `authorization_url`
4. On callback, `verifyTransaction` then `UPDATE ... SET payment_status = 'paid', paystack_reference = $1`

## Admin

| Route | Purpose |
|-------|---------|
| `/admin/login` | Sign in |
| `/admin` | Overview stats |
| `/admin/events` | Add (URL or file) / delete |
| `/admin/gallery` | Upload or URL / delete |
| `/admin/orders` | Ticket orders + payment status + CSV |
| `/admin/vendors` | Vendor bookings + payment status + CSV |
| `/admin/pricing` | Vendor & partner pricing |

**Default credentials:** `admin@abujafoodfest.com` / `admin123`

## Environment

See `.env.example`:

- `DATABASE_URL` (required)
- `DATABASE_SSL` (managed Postgres)
- `AUTH_SECRET`
- `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (optional)

## Design tokens

`--red` #D8261E · `--gold` #FFC72C · `--cream` #FFF8EA · `--ink` #231A12  
Fonts: Baloo 2 + Plus Jakarta Sans

**Phase 6 delivered.**
