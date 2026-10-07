import Link from "next/link";

export default function EventNotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Event not found</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
          That event doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/events" className="btn btn-primary">
          Browse all events
        </Link>
      </div>
    </section>
  );
}
