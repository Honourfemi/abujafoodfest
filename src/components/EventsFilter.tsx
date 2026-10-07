"use client";

import { useMemo, useState } from "react";
import type { Event } from "@/types";
import { EventCard } from "./EventCard";

const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "Campus Tour", label: "Campus Tour" },
  { key: "Flagship", label: "Flagship Festival" },
  { key: "Night Market", label: "Night Market" },
  { key: "Live Music", label: "Live Sessions" },
] as const;

export function EventsFilter({ events }: { events: Event[] }) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return events;
    return events.filter((e) => e.badge.toLowerCase().includes(active.toLowerCase()));
  }, [events, active]);

  return (
    <>
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-chip${active === f.key ? " active" : ""}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ background: "var(--cream-2)", padding: 32, borderRadius: 18, textAlign: "center" }}>
          <p style={{ color: "var(--ink-soft)" }}>No events match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}
    </>
  );
}
