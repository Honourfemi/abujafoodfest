"use client";

import { useState } from "react";
import type { GalleryItem } from "@/types";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "food", label: "Food" },
  { key: "events", label: "Events" },
  { key: "vendors", label: "Vendors" },
  { key: "entertainment", label: "Entertainment" },
  { key: "brand", label: "Brand Activations" },
] as const;

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const visible =
    filter === "all" ? items : items.filter((g) => g.category === filter);

  return (
    <>
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-chip${filter === f.key ? " active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="gallery-masonry">
        {visible.map((g) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={g.id}
            src={g.src}
            alt={g.alt}
            data-cat={g.category}
            onClick={() => setLightbox(g.src)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>

      {lightbox && (
        <div className="lightbox active" onClick={() => setLightbox(null)} role="dialog">
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Enlarged gallery photo" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
