import Link from "next/link";
import { PageBanner } from "@/components/PageBanner";

export default function AboutPage() {
  return (
    <>
      <PageBanner
        breadcrumb="About"
        eyebrow="Our Story"
        title="The Culture Behind the Cuisine"
        description="Abuja Food Fest started as a small gathering of food lovers and has grown into the capital's most anticipated food and lifestyle experience."
      />

      <section className="section">
        <div className="container">
          <div className="about-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop"
              alt="Crowd at Abuja Food Fest"
            />
            <div>
              <span className="eyebrow">Who we are</span>
              <h2 style={{ fontSize: 32, marginTop: 14 }}>Built by food lovers, for the whole city</h2>
              <p style={{ marginTop: 16, color: "var(--ink-soft)" }}>
                Abuja Food Fest is a food, culture and entertainment platform bringing together the
                best local vendors, emerging brands and live performers under one roof. We started
                in 2023 with a single campus pop-up and have since grown into a multi-city,
                multi-campus movement.
              </p>
              <p style={{ marginTop: 14, color: "var(--ink-soft)" }}>
                Every event we run is designed around one idea: food tastes better shared. Whether
                it&apos;s a university courtyard or Jabi Lake&apos;s open grounds, we build spaces
                where people eat well, connect, and discover something new.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream2">
        <div className="container">
          <div className="grid grid-3">
            <div className="value-card">
              <b>Our Mission</b>
              <p>
                To create accessible, high-energy spaces where Nigerian food culture, small
                businesses and entertainment thrive together.
              </p>
            </div>
            <div className="value-card">
              <b>Our Vision</b>
              <p>
                To become West Africa&apos;s leading food and lifestyle festival platform, known for
                discovering the next generation of food brands.
              </p>
            </div>
            <div className="value-card">
              <b>What We Represent</b>
              <p>
                Community, culture and celebration — a stage for Nigerian vendors, chefs and
                performers to be seen and supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our journey</span>
            <h2>Impact So Far</h2>
          </div>
          <div className="grid grid-4" style={{ marginBottom: 56 }}>
            <div className="stat-block">
              <b>25,000+</b>
              <span>Attendees</span>
            </div>
            <div className="stat-block">
              <b>180+</b>
              <span>Vendors supported</span>
            </div>
            <div className="stat-block">
              <b>30+</b>
              <span>Brand partners</span>
            </div>
            <div className="stat-block">
              <b>12</b>
              <span>Events hosted</span>
            </div>
          </div>
          <div className="grid grid-2" style={{ alignItems: "start" }}>
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 20 }}>Milestones</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <b>2023 — The First Pop-Up</b>
                  <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                    A single-campus food gathering with 8 vendors and 400 attendees.
                  </span>
                </div>
                <div className="timeline-item">
                  <b>2024 — Going Multi-Campus</b>
                  <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                    Expanded the Campus Tour to 3 universities across Abuja.
                  </span>
                </div>
                <div className="timeline-item">
                  <b>2025 — First Flagship Festival</b>
                  <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                    Launched our first citywide festival at Jabi Lake with 60+ vendors.
                  </span>
                </div>
                <div className="timeline-item">
                  <b>2026 — Brand Partnerships Take Off</b>
                  <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                    Partnered with 30+ national brands and grew the Campus Tour to 5 schools.
                  </span>
                </div>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop"
              alt="Vendors serving food at Abuja Food Fest"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)" }}
            />
          </div>
        </div>
      </section>

      <section className="section bg-cream2" style={{ paddingBottom: 96 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 30 }}>Why People Attend</h2>
          <p style={{ color: "var(--ink-soft)", maxWidth: 560, margin: "14px auto 30px" }}>
            Great food from real local vendors, performances you won&apos;t find elsewhere, and a
            crowd that shows up to celebrate. Come hungry, leave inspired.
          </p>
          <Link href="/tickets" className="btn btn-primary">
            Get Your Ticket
          </Link>
        </div>
      </section>
    </>
  );
}
