"use client";

import { useMemo, useState } from "react";
import type { TicketOrder } from "@/types";
import { fmtNaira } from "@/lib/format";

export function AdminOrdersClient({ orders }: { orders: TicketOrder[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter(
      (o) =>
        o.name.toLowerCase().includes(needle) ||
        o.email.toLowerCase().includes(needle) ||
        o.event_name.toLowerCase().includes(needle)
    );
  }, [orders, q]);

  function exportCsv() {
    if (!orders.length) {
      alert("No orders to export yet.");
      return;
    }
    const header = "Name,Email,Phone,Event,Tickets,Qty,Total,PaymentStatus,PaystackRef,Date\n";
    const rows = orders
      .map((o) =>
        [o.name, o.email, o.phone ?? "", o.event_name, o.tickets_json, o.qty, o.total, o.payment_status ?? "pending", o.paystack_reference ?? "", o.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abuja-food-fest-ticket-orders.csv";
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
          placeholder="Search name, email, event…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={exportCsv}>
          Export CSV
        </button>
      </div>
      <div className="admin-table-wrap">
        {!filtered.length ? (
          <div className="admin-empty">No ticket orders yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event</th>
                <th>Tickets</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                let ticketsLabel = o.tickets_json;
                try {
                  const parsed = JSON.parse(o.tickets_json) as { name: string; qty: number }[];
                  ticketsLabel = parsed.map((t) => `${t.name} × ${t.qty}`).join(", ");
                } catch {
                  /* keep raw */
                }
                return (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.phone || "—"}</td>
                    <td>{o.event_name}</td>
                    <td>{ticketsLabel}</td>
                    <td>{o.qty}</td>
                    <td>{fmtNaira(o.total)}</td>
                    <td>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: o.payment_status === "paid" ? "#E7F5EB" : "#FFF3F0",
                        color: o.payment_status === "paid" ? "var(--green-ok)" : "var(--red)",
                        textTransform: "capitalize",
                      }}>
                        {o.payment_status || "pending"}
                      </span>
                    </td>
                    <td>
                      {new Date(o.created_at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
