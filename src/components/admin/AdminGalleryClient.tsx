"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/types";
import { uploadGalleryImage, deleteGalleryItem } from "@/lib/actions";

const CATS = ["food", "events", "entertainment", "vendors", "brand"] as const;

export function AdminGalleryClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("food");
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const fd = new FormData();
    fd.set("category", category);
    fd.set("alt", alt);
    if (src.trim()) fd.set("src", src.trim());
    const file = fileRef.current?.files?.[0];
    if (file) fd.set("file", file);

    startTransition(async () => {
      const result = await uploadGalleryImage(fd);
      if (result.ok) {
        setSrc("");
        setAlt("");
        setFileName(null);
        if (fileRef.current) fileRef.current.value = "";
        setSuccess(result.message || "Image added.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this image? Local uploads will also be removed from disk.")) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteGalleryItem(id);
      if (!result.ok) setError(result.error);
      else setSuccess("Image deleted.");
      router.refresh();
    });
  }

  return (
    <>
      <form className="form-card" style={{ marginBottom: 28 }} onSubmit={handleAdd}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }}>Add image</h3>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 16 }}>
          Upload a file (JPEG, PNG, WebP, GIF · max 5 MB) or paste an external image URL.
        </p>
        <div className="field-row">
          <div className="field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Caption / Alt</label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Short description"
            />
          </div>
        </div>
        <div className="field">
          <label>Upload image file</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFileName(f ? f.name : null);
            }}
          />
          {fileName && (
            <span style={{ fontSize: 13, color: "var(--ink-soft)", display: "block", marginTop: 6 }}>
              Selected: {fileName}
            </span>
          )}
        </div>
        <div className="field">
          <label>Or image URL</label>
          <input
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        {error && (
          <p style={{ color: "var(--red)", fontWeight: 600, fontSize: 14 }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "var(--green-ok)", fontWeight: 600, fontSize: 14 }}>{success}</p>
        )}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add to Gallery"}
        </button>
      </form>

      {!initialItems.length ? (
        <div className="admin-empty">No images yet.</div>
      ) : (
        <div className="admin-thumb-grid">
          {initialItems.map((g) => (
            <div className="admin-thumb" key={g.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.alt} />
              <button
                type="button"
                className="admin-thumb-del"
                onClick={() => handleDelete(g.id)}
                aria-label="Delete"
                disabled={pending}
              >
                ×
              </button>
              <div className="admin-thumb-cat">
                {g.category}
                {g.src.startsWith("/uploads/") ? " · local" : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
