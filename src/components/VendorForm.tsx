"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { fmtNaira } from "@/lib/format";
import type { VendorPricing } from "@/types";
import { createVendorBooking } from "@/lib/actions";

const PACKAGE_LABELS: Record<string, string> = {
  single: "Single Campus Stall",
  multi: "Multi-Campus Stall",
  flagship: "Flagship Festival Stall",
};

const FEE = 1000;

export function VendorForm({ pricing }: { pricing: VendorPricing }) {
  const [pkg, setPkg] = useState<"single" | "multi" | "flagship">("multi");
  const [qty, setQty] = useState(1);
  const [business, setBusiness] = useState("");
  const [category, setCategory] = useState("Small Chops");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [dates, setDates] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const summary = useMemo(() => {
    const unit = pricing[pkg] || 0;
    const subtotal = unit * Math.max(1, qty);
    return { unit, subtotal, total: subtotal + FEE };
  }, [pkg, qty, pricing]);

  function handleSubmit() {
    setError(null);
    if (!business.trim() || !contact.trim() || !email.trim()) {
      setError("Please fill in at least your business name, contact name and email.");
      return;
    }

    startTransition(async () => {
      const result = await createVendorBooking({
        business,
        category,
        contact,
        phone,
        email,
        instagram,
        package: PACKAGE_LABELS[pkg] || pkg,
        qty,
        dates,
        total: summary.total,
      });
      if (result.ok) {
        setConfirmed(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (confirmed) {
    return (
      <div id="vendorConfirmation" style={{ marginTop: 50 }}>
        <div className="confirm-card">
          <div className="confirm-icon">✓</div>
          <h3>Stall Booked! 🎉</h3>
          <p>
            Thanks, {business}! Your {PACKAGE_LABELS[pkg]} booking ({qty} stall
            {qty > 1 ? "s" : ""}) has been received. A confirmation will be sent to {email}.
          </p>
          <div className="ticket-qr" />
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-wrap">
      <div className="form-card">
        <h3>Business Information</h3>
        <div className="field-row">
          <div className="field">
            <label>Business Name</label>
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="e.g. Mama Ngozi's Kitchen"
            />
          </div>
          <div className="field">
            <label>Food Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Small Chops</option>
              <option>Grills & BBQ</option>
              <option>Local Dishes</option>
              <option>Drinks & Smoothies</option>
              <option>Desserts & Pastries</option>
              <option>International</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Contact Person</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080X XXX XXXX"
            />
          </div>
        </div>
        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
          />
        </div>
        <div className="field">
          <label>Instagram / Social Handle</label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@yourbusiness"
          />
        </div>

        <h3 style={{ marginTop: 20 }}>Package Selection</h3>
        <div className="field-row">
          <div className="field">
            <label>Select Package</label>
            <select
              value={pkg}
              onChange={(e) => setPkg(e.target.value as typeof pkg)}
            >
              <option value="single">
                Single Campus Stall — {fmtNaira(pricing.single)}
              </option>
              <option value="multi">
                Multi-Campus Stall — {fmtNaira(pricing.multi)}/stall
              </option>
              <option value="flagship">
                Flagship Festival Stall — {fmtNaira(pricing.flagship)}
              </option>
            </select>
          </div>
          <div className="field">
            <label>Number of Stalls</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>
        <div className="field">
          <label>Preferred Campus / Event Date(s)</label>
          <input
            type="text"
            value={dates}
            onChange={(e) => setDates(e.target.value)}
            placeholder="e.g. Veritas (13 Nov), Nile (20 Nov)"
          />
        </div>
      </div>

      <aside className="summary-card">
        <h3>Booking Summary</h3>
        <div className="summary-line">
          <span>
            {PACKAGE_LABELS[pkg]} × {qty}
          </span>
          <span>{fmtNaira(summary.subtotal)}</span>
        </div>
        <div className="summary-line">
          <span>Processing fee</span>
          <span>{fmtNaira(FEE)}</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>{fmtNaira(summary.total)}</span>
        </div>
        {error && (
          <p style={{ color: "var(--red)", fontSize: 14, marginTop: 12, fontWeight: 600 }}>
            {error}
          </p>
        )}
        <button
          className="btn btn-gold btn-block"
          style={{ marginTop: 20 }}
          onClick={handleSubmit}
          disabled={pending}
        >
          {pending ? "Processing…" : "Book & Pay"}
        </button>
        <div className="secure-note">🔒 Secure payment · Instant confirmation</div>
      </aside>
    </div>
  );
}
