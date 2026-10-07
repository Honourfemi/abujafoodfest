"use client";

import { useMemo, useState } from "react";
import type { VendorBooking } from "@/types";
import { fmtNaira } from "@/lib/format";

export function AdminVendorsClient({ bookings }: { bookings: VendorBooking[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return bookings;
    return bookings.filter(
      (v) =>
        v.business.toLowerCase().includes(needle) ||
        v.email.toLowerCase().includes(needle) ||
        v.contact.toLowerCase().includes(needle)
    );
  }, [bookings, q]);

  function exportCsv() {
    if (!bookings.length) {
      alert("No vendor bookings to export yet.");
      return;
    }
    const header =
      "Business,Contact,Email,Phone,Category,Package,Qty,Dates,Total,PaymentStatus,PaystackRef,Date\n";
    const rows = bookings
      .map((v) =>
        [
          v.business,
          v.contact,
          v.email,
          v.phone ?? "",
          v.category,
          v.package,
          v.qty,
          v.dates ?? "",
          v.total,
          v.payment_status ?? "pending",
          v.paystack_reference ?? "",
          v.created_at,
        ]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abuja-food-fest-vendor-bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <input
          className="input"
          style={{
            minWidth: 240,
            background: "#fff",
            color: "var(--ink)",
            borderColor: "var(--line)",
          }}
          placeholder="Search business, contact, email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <div className="admin-table-wrap">
        {!filtered.length ? (
          <div className="admin-empty">No vendor bookings yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Category</th>
                <th>Package</th>
                <th>Qty</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id}>
                  <td>{v.business}</td>
                  <td>{v.contact}</td>
                  <td>{v.email}</td>
                  <td>{v.phone || "—"}</td>
                  <td>{v.category || "—"}</td>
                  <td>{v.package}</td>
                  <td>{v.qty}</td>
                  <td>{v.dates || "—"}</td>
                  <td>{fmtNaira(v.total)}</td>
                  <td>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: v.payment_status === "paid" ? "#E7F5EB" : "#FFF3F0",
                      color: v.payment_status === "paid" ? "var(--green-ok)" : "var(--red)",
                      textTransform: "capitalize",
                    }}>
                      {v.payment_status || "pending"}
                    </span>
                  </td>
                  <td>
                    {new Date(v.created_at).toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
