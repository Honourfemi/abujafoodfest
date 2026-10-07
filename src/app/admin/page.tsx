import { assertAdmin } from "@/lib/admin-guard";
import { getOverviewStats } from "@/lib/queries";
import { fmtNaira } from "@/lib/format";
import Link from "next/link";

export default async function AdminOverviewPage() {
  await assertAdmin();
  const stats = await getOverviewStats();

  return (
    <div className="admin-panel active">
      <h2>Overview</h2>
      <p className="sub">Live snapshot of tickets, vendors, events and gallery.</p>

      <div className="admin-stat-grid">
        <div className="stat-block">
          <b>{stats.ticketsSold}</b>
          <span>Tickets sold</span>
        </div>
        <div className="stat-block">
          <b>{fmtNaira(stats.ticketRevenue)}</b>
          <span>Ticket revenue</span>
        </div>
        <div className="stat-block">
          <b>{stats.vendorStalls}</b>
          <span>Vendor stalls booked</span>
        </div>
        <div className="stat-block">
          <b>{fmtNaira(stats.vendorRevenue)}</b>
          <span>Vendor revenue</span>
        </div>
      </div>

      <div className="admin-stat-grid" style={{ marginTop: 18 }}>
        <div className="stat-block">
          <b>{stats.events}</b>
          <span>Events</span>
        </div>
        <div className="stat-block">
          <b>{stats.gallery}</b>
          <span>Gallery images</span>
        </div>
        <div className="stat-block">
          <b>{stats.vendorBusinesses}</b>
          <span>Unique vendors</span>
        </div>
        <div className="stat-block">
          <b>{stats.newsletter}</b>
          <span>Newsletter subscribers</span>
        </div>
      </div>

      <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/admin/orders" className="btn btn-primary btn-sm">
          View ticket orders
        </Link>
        <Link href="/admin/vendors" className="btn btn-outline btn-sm">
          View vendor bookings
        </Link>
        <Link href="/admin/events" className="btn btn-outline btn-sm">
          Manage events
        </Link>
      </div>
    </div>
  );
}
