import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById, getVendorPricing } from "@/lib/queries";
import { fmtNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

const CAMPUS_SCHEDULE = [
  { date: "7 Nov", place: "Bingham University" },
  { date: "13 Nov", place: "Veritas University" },
  { date: "20 Nov", place: "Nile University" },
  { date: "26 Nov", place: "University of Abuja" },
  { date: "28 Nov", place: "Philomath University" },
];

const FAQS = [
  {
    q: "Is the Campus Tour free to attend?",
    a: "Yes — entry is completely free for students and guests at every campus stop.",
  },
  {
    q: "Do I need a ticket?",
    a: "No ticket is required for the Campus Tour. Just show up at any of the five campus dates.",
  },
  {
    q: "How can my business sell at a stop?",
    a: "Vendors can book a stall through our Vendor Registration page — packages start at ₦20,000 per stall.",
  },
  {
    q: "Can my school host a future stop?",
    a: 'Yes — reach out via our Contact page and select "Partnership Enquiry" to discuss hosting.',
  },
];

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const pricing = await getVendorPricing();
  const isCampus = event.id === "ev-campus-tour";

  return (
    <>
      <section className="section--tight">
        <div className="container">
          <p className="breadcrumb" style={{ color: "var(--ink-soft)", marginBottom: 18 }}>
            Home / Events / <b style={{ color: "var(--red)" }}>{event.title}</b>
          </p>
          <div className="event-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={event.image_url} alt={event.title} />
            <div className="event-hero__body">
              <span className="pill-tag">{event.badge}</span>
              <h1>{event.title}</h1>
              <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 8 }}>
                {event.date} · {event.location} · {event.price}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="event-detail-grid">
            <div>
              <h2 style={{ fontSize: 26 }}>About This Event</h2>
              <p style={{ marginTop: 14, color: "var(--ink-soft)" }}>{event.description}</p>
              {isCampus && (
                <p style={{ marginTop: 12, color: "var(--ink-soft)" }}>
                  The Campus Tour brings Abuja Food Fest directly to students — five universities,
                  five food-filled days. Local vendors set up shop between lectures, turning
                  ordinary campus grounds into a festival of flavour, music and community.
                </p>
              )}

              <div style={{ marginTop: 28 }}>
                <div className="info-row">
                  <div className="ic">📅</div>
                  <div>
                    <b>Dates</b>
                    <span>{event.date.replace("📅 ", "")}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ic">📍</div>
                  <div>
                    <b>Venue</b>
                    <span>{event.location.replace("📍 ", "")}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="ic">🎟️</div>
                  <div>
                    <b>Entry</b>
                    <span>{event.price}</span>
                  </div>
                </div>
              </div>

              {isCampus && (
                <>
                  <h3 style={{ fontSize: 20, marginTop: 34 }}>Schedule &amp; Highlights</h3>
                  <ul className="tour-stops" style={{ marginTop: 16, color: "var(--ink)" }}>
                    {CAMPUS_SCHEDULE.map((s) => (
                      <li key={s.date}>
                        <span className="date" style={{ color: "var(--red)" }}>
                          {s.date}
                        </span>{" "}
                        {s.place}
                      </li>
                    ))}
                  </ul>

                  <h3 style={{ fontSize: 20, marginTop: 34 }}>Frequently Asked Questions</h3>
                  <div style={{ marginTop: 12 }}>
                    {FAQS.map((f, i) => (
                      <details key={f.q} className="faq-item" open={i === 0}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                  </div>
                </>
              )}

              <div className="share-row">
                <a href="#" aria-label="Share on X">
                  X
                </a>
                <a href="#" aria-label="Share on Instagram">
                  IG
                </a>
                <a href="#" aria-label="Share on WhatsApp">
                  WA
                </a>
                <a href="#" aria-label="Copy link">
                  🔗
                </a>
              </div>
            </div>

            <aside className="sticky-buy">
              <h3 style={{ fontSize: 19 }}>{isCampus ? "Join the Campus Tour" : "Get Tickets"}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 6 }}>
                {isCampus ? "Free entry for all campus stops." : event.price}
              </p>
              {isCampus ? (
                <>
                  <div className="price-row">
                    <span>Student entry</span>
                    <b>Free</b>
                  </div>
                  <div className="price-row">
                    <span>Vendor stall (1 campus)</span>
                    <b>{fmtNaira(pricing.single)}</b>
                  </div>
                  <div className="price-row">
                    <span>Vendor stall (2+ campuses)</span>
                    <b>{fmtNaira(pricing.multi)}</b>
                  </div>
                  <Link href="/vendor" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
                    Book a Vendor Stall
                  </Link>
                  <Link href="/tickets" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                    Get Flagship Event Tickets
                  </Link>
                </>
              ) : (
                <>
                  <div className="price-row">
                    <span>Starting from</span>
                    <b>{event.price}</b>
                  </div>
                  <Link href="/tickets" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
                    Buy Tickets
                  </Link>
                  <Link href="/vendor" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
                    Book a Vendor Stall
                  </Link>
                </>
              )}
              <div className="secure-note">🔒 Secure booking · Instant confirmation</div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
