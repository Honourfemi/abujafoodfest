"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/tickets", label: "Tickets" },
  { href: "/vendor", label: "Vendors" },
  { href: "/partnership", label: "Partnership" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="dot" />
          Abuja Food Fest
        </Link>

        <ul className="nav-links">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);
            return (
              <li key={item.href}>
                <Link href={item.href} className={active ? "is-active" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-right">
          <Link href="/tickets" className="btn btn-primary btn-sm">
            Get Tickets
          </Link>
          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-panel${open ? " open" : ""}`}>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
