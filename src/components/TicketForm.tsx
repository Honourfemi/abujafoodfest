"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { fmtNaira } from "@/lib/format";
import { createTicketOrder } from "@/lib/actions";

type TicketOption = {
  name: string;
  price: number;
  desc: string;
};

const TICKETS: TicketOption[] = [
  { name: "General Access", price: 5000, desc: "Full-day festival entry" },
  { name: "VIP Access", price: 15000, desc: "Priority entry, lounge access, welcome drink" },
  { name: "Group Pass (4)", price: 18000, desc: "4 general access tickets bundled" },
];

const FEE = 300;

export function TicketForm({ eventOptions }: { eventOptions: string[] }) {
  const [eventName, setEventName] = useState(eventOptions[0] ?? "");
  const [qty, setQty] = useState<number[]>([1, 0, 0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const { subtotal, parts, total } = useMemo(() => {
    let sub = 0;
    const p: string[] = [];
    TICKETS.forEach((t, i) => {
      if (qty[i] > 0) {
        sub += qty[i] * t.price;
        p.push(`${t.name} × ${qty[i]}`);
      }
    });
    const fee = sub > 0 ? FEE : 0;
    return { subtotal: sub, parts: p, total: sub + fee };
  }, [qty]);

  function setQtyAt(i: number, delta: number) {
    setQty((prev) => {
      const next = [...prev];
      next[i] = Math.max(0, next[i] + delta);
      return next;
    });
  }

  function handleSubmit() {
    setError(null);
    if (subtotal <= 0) {
      setError("Please select at least one ticket.");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email to continue.");
      return;
    }

    const tickets = TICKETS.map((t, i) => ({
      name: t.name,
      qty: qty[i],
      price: t.price,
    })).filter((t) => t.qty > 0);

    startTransition(async () => {
      const result = await createTicketOrder({
        name,
        email,
        phone,
        eventName,
        tickets,
        total,
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
      <div className="confirm-card" style={{ margin: "40px auto" }}>
        <div className="confirm-icon">✓</div>
        <h3>Ticket Confirmed! 🎉</h3>
        <p>
          Your ticket for <strong>{eventName}</strong> has been confirmed. A copy will be sent to{" "}
          {email}.
        </p>
        <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
          {parts.join(", ")} · Total {fmtNaira(total)}
        </p>
        <div className="ticket-qr" />
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="ticket-wrap">
      <div>
        <div className="form-card">
          <h3>1. Choose Event</h3>
          <div className="field">
            <label>Event</label>
            <select value={eventName} onChange={(e) => setEventName(e.target.value)}>
              {eventOptions.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-card" style={{ marginTop: 24 }}>
          <h3>2. Select Tickets</h3>
          {TICKETS.map((t, i) => (
            <div
              key={t.name}
              className={`ticket-type${selected === i ? " selected" : ""}`}
              onClick={() => setSelected(i)}
              role="button"
              tabIndex={0}
            >
              <div>
                <b>{t.name}</b>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>{t.desc}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span className="event-card__price" style={{ whiteSpace: "nowrap" }}>
                  {fmtNaira(t.price)}
                </span>
                <div className="qty-control" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => setQtyAt(i, -1)} aria-label="Decrease">
                    −
                  </button>
                  <span>{qty[i]}</span>
                  <button type="button" onClick={() => setQtyAt(i, 1)} aria-label="Increase">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-card" style={{ marginTop: 24 }}>
          <h3>3. Your Details</h3>
          <div className="field-row">
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amaka Johnson"
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
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div className="form-card" style={{ marginTop: 24 }}>
          <h3>4. Payment</h3>
          <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 12 }}>
            Checkout is ready for <strong>Paystack</strong> (Card, Bank Transfer, USSD).
            Your order is saved as <strong>pending</strong> until payment is confirmed.
          </p>
          <div className="pay-methods" style={{ marginTop: 8 }}>
            <span className="pay-chip" style={{ background: "var(--cream-2)", color: "var(--ink)" }}>Paystack</span>
            <span className="pay-chip" style={{ background: "var(--cream-2)", color: "var(--ink)" }}>Card</span>
            <span className="pay-chip" style={{ background: "var(--cream-2)", color: "var(--ink)" }}>Bank Transfer</span>
            <span className="pay-chip" style={{ background: "var(--cream-2)", color: "var(--ink)" }}>USSD</span>
          </div>
          <div className="secure-note" style={{ marginTop: 12 }}>
            🔒 When Paystack keys are set, you will be redirected to a secure checkout page.
          </div>
        </div>
      </div>

      <aside className="summary-card">
        <h3>Order Summary</h3>
        <div className="summary-line">
          <span>{parts.length ? parts.join(", ") : "No tickets selected"}</span>
          <span>{fmtNaira(subtotal)}</span>
        </div>
        <div className="summary-line">
          <span>Booking fee</span>
          <span>{fmtNaira(subtotal > 0 ? FEE : 0)}</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>{fmtNaira(total)}</span>
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
          {pending ? "Processing…" : "Confirm & Pay"}
        </button>
        <div className="secure-note">🔒 256-bit secure checkout</div>
        <div className="pay-methods">
          <span className="pay-chip">Card</span>
          <span className="pay-chip">Bank Transfer</span>
          <span className="pay-chip">USSD</span>
        </div>
      </aside>
    </div>
  );
}
