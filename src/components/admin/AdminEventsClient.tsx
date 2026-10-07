"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Event } from "@/types";
import { createEventWithUpload, deleteEvent } from "@/lib/actions";

export function AdminEventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    badge: "Event",
    date: "",
    location: "",
    price: "",
    image_url: "",
    description: "",
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("badge", form.badge);
    fd.set("date", form.date);
    fd.set("location", form.location);
    fd.set("price", form.price);
    fd.set("description", form.description);
    if (form.image_url.trim()) fd.set("image_url", form.image_url.trim());
    const file = fileRef.current?.files?.[0];
    if (file) fd.set("file", file);

    startTransition(async () => {
      const result = await createEventWithUpload(fd);
      if (result.ok) {
        setForm({
          title: "",
          badge: "Event",
          date: "",
          location: "",
          price: "",
          image_url: "",
          description: "",
        });
        setFileName(null);
        if (fileRef.current) fileRef.current.value = "";
        setSuccess("Event created.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this event? Local image uploads will also be deleted.")) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteEvent(id);
      if (!result.ok) setError(result.error);
      else setSuccess("Event removed.");
      router.refresh();
    });
  }

  return (
    <>
      <form className="form-card" style={{ marginBottom: 28 }} onSubmit={handleAdd}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }}>Add event</h3>
        <div className="field-row">
          <div className="field">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Event name"
            />
          </div>
          <div className="field">
            <label>Badge</label>
            <input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="e.g. Campus Tour"
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Date</label>
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              placeholder="📅 13 Nov 2026"
            />
          </div>
          <div className="field">
            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              placeholder="📍 Venue"
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Price</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="From ₦5,000"
            />
          </div>
          <div className="field">
            <label>Image URL (optional)</label>
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://... or leave blank if uploading"
            />
          </div>
        </div>
        <div className="field">
          <label>Or upload event image</label>
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
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description"
          />
        </div>
        {error && (
          <p style={{ color: "var(--red)", fontWeight: 600, fontSize: 14 }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "var(--green-ok)", fontWeight: 600, fontSize: 14 }}>{success}</p>
        )}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add Event"}
        </button>
      </form>

      <div className="admin-table-wrap">
        {initialEvents.length === 0 ? (
          <div className="admin-empty">No events yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {initialEvents.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    <b>{ev.title}</b>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{ev.badge}</div>
                  </td>
                  <td>{ev.date}</td>
                  <td>{ev.location}</td>
                  <td>{ev.price}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-del-btn"
                      onClick={() => handleDelete(ev.id)}
                      disabled={pending}
                    >
                      Remove
                    </button>
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
