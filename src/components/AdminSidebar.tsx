"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/lib/actions";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/orders", label: "Ticket Orders" },
  { href: "/admin/vendors", label: "Vendor Bookings" },
  { href: "/admin/pricing", label: "Pricing" },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname() || "";

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="dot" style={{ width: 10, height: 10, background: "var(--gold)", borderRadius: "50%", display: "inline-block" }} />
        <span style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>
          AFF Admin
        </span>
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", padding: "0 12px 16px", margin: 0 }}>
        {email}
      </p>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-tab-btn${isActive(item.href, item.exact) ? " active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={adminLogout}>
        <button type="submit" className="admin-tab-btn logout" style={{ width: "100%" }}>
          Log out
        </button>
      </form>
    </aside>
  );
}
