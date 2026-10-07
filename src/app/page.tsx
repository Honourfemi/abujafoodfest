import Link from "next/link";
import { getAllEvents, getGallery } from "@/lib/queries";
import { EventCard } from "@/components/EventCard";
import { NewsletterForm } from "@/components/NewsletterForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const events = await getAllEvents();
  const gallery = (await getGallery()).slice(0, 8);
  const nonTour = events.filter((e) => e.id !== "ev-campus-tour");

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-shape s1" />
        <div className="hero-shape s2" />
        <div className="hero-inner" style={{ paddingBottom: 60 }}>
          <div className="hero-copy">
            <span className="eyebrow">
              🔥 Nigeria&apos;s Fastest Growing Food Festival
            </span>
            <h1>
              Where Food, Culture <span className="accent">&amp;</span>{" "}
              Entertainment Come Together
            </h1>
            <p>
              Abuja&apos;s premier food festival experience — campus tours,
              flagship editions, night markets and more.
            </p>
            <div className="hero-ctas">
              <Link href="/tickets" className="btn btn-gold">
                Get Your Ticket
              </Link>
              <Link href="/vendor" className="btn btn-outline-light">
                Become a Vendor
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <b>25K+</b>
                <span>Attendees hosted</span>
              </div>
              <div className="stat">
                <b>180+</b>
                <span>Vendors featured</span>
              </div>
              <div className="stat">
                <b>30+</b>
                <span>Brand partners</span>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <span className="hero-card-tag">Nov 2026 🎟️</span>
            <div className="hero-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=700&auto=format&fit=crop"
                alt="Crowd enjoying Abuja Food Fest"
              />
            </div>
          </div>
        </div>
        <svg
          className="hero-wave"
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            fill="var(--cream)"
          />
        </svg>
      </section>

      {/* Upcoming events */}
      <section className="section" id="home-events">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What&apos;s coming up</span>
            <h2>Upcoming Events</h2>
            <p>
              Campus tours, flagship festivals and more — loaded live from the
              database.
            </p>
          </div>

          {/* Featured Campus Tour */}
          <div className="feature-tour" style={{ marginBottom: 32 }}>
            <div className="feature-tour__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop"
                alt="Campus Tour"
              />
            </div>
            <div className="feature-tour__body">
              <span className="pill-tag">Campus Tour · Nov 2026</span>
              <h3>The Campus Tour is landing at 5 schools this November</h3>
              <p style={{ opacity: 0.9, fontSize: 15 }}>
                Food stalls, music and student vibes touching down at five
                universities.
              </p>
              <ul className="tour-stops">
                <li>
                  <span className="date">7 Nov</span> Bingham University
                </li>
                <li>
                  <span className="date">13 Nov</span> Veritas University
                </li>
                <li>
                  <span className="date">20 Nov</span> Nile University
                </li>
                <li>
                  <span className="date">26 Nov</span> University of Abuja
                </li>
                <li>
                  <span className="date">28 Nov</span> Philomath University
                </li>
              </ul>
              <div className="feature-tour__ctas">
                <Link href="/events/ev-campus-tour" className="btn btn-gold">
                  View Event Details
                </Link>
                <Link href="/vendor" className="btn btn-outline-light">
                  Book a Vendor Stall
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-3">
            {nonTour.slice(0, 3).map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/events" className="btn btn-outline">
              See All Events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA split */}
      <section className="section section--tight bg-cream2">
        <div className="container">
          <div className="cta-split">
            <div className="cta-box vendor-box">
              <span className="pill-tag" style={{ background: "var(--gold)" }}>
                Call for Vendors
              </span>
              <h3>Sell your food to thousands of hungry fans</h3>
              <p>
                Book a stall at our Campus Tour or flagship festival — simple
                pricing, real foot traffic.
              </p>
              <Link href="/vendor" className="btn btn-gold">
                Book a Vendor Slot
              </Link>
            </div>
            <div className="cta-box partner-box">
              <span
                className="pill-tag"
                style={{ background: "var(--ink)", color: "var(--gold)" }}
              >
                Partnership Opportunities
              </span>
              <h3>Put your brand in front of Abuja&apos;s food-loving crowd</h3>
              <p>
                From campus activations to title sponsorship — packages that put
                your brand front and centre.
              </p>
              <Link href="/partnership" className="btn btn-primary">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section--tight">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 20 }}>
            <span className="eyebrow">Trusted by</span>
            <h2 style={{ fontSize: 28 }}>Brands We&apos;ve Worked With</h2>
          </div>
          <div className="logo-strip">
            {[
              "Chivita",
              "Coca-Cola",
              "Jumia",
              "MTN",
              "Chicken Republic",
              "Moniepoint",
              "Kwik",
            ].map((b) => (
              <span key={b} className="logo-chip">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">By the numbers</span>
            <h2>Why Abuja Food Fest</h2>
          </div>
          <div className="grid grid-4">
            <div className="stat-block">
              <b>25,000+</b>
              <span>Total attendees</span>
            </div>
            <div className="stat-block">
              <b>180+</b>
              <span>Vendors hosted</span>
            </div>
            <div className="stat-block">
              <b>30+</b>
              <span>Brand collaborations</span>
            </div>
            <div className="stat-block">
              <b>3 yrs</b>
              <span>Running strong</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section bg-cream2">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Relive the moments</span>
            <h2>Gallery Preview</h2>
          </div>
          <div className="gallery-masonry compact">
            {gallery.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={g.id} src={g.src} alt={g.alt} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/gallery" className="btn btn-outline">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section--tight">
        <div className="container">
          <div className="newsletter">
            <div>
              <h3>Never miss a festival</h3>
              <p>
                Get dates, ticket drops and vendor calls straight to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
