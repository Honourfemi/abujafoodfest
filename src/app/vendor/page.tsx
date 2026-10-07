import Link from "next/link";
import { getVendorPricing } from "@/lib/queries";
import { fmtNaira } from "@/lib/format";
import { PageBanner } from "@/components/PageBanner";
import { VendorForm } from "@/components/VendorForm";

export const dynamic = "force-dynamic";

const SLOTS = [
  { name: "Bingham", date: "7 Nov", left: 8 },
  { name: "Veritas", date: "13 Nov", left: 12 },
  { name: "Nile", date: "20 Nov", left: 6 },
  { name: "UniAbuja", date: "26 Nov", left: 15 },
  { name: "Philomath", date: "28 Nov", left: 10 },
];

export default function VendorPage() {
  const pricing = await getVendorPricing();

  return (
    <>
      <PageBanner
        breadcrumb="Become a Vendor"
        eyebrow="Call for Vendors"
        title="Sell Your Food to Thousands"
        description="Book your stall at our next Campus Tour stop or flagship festival — simple registration, transparent pricing."
      />

      <section className="section">
        <div className="container">
          <div className="vendor-hero">
            <div>
              <h2 style={{ fontSize: 28, color: "var(--white)" }}>
                Why Vendors Love Abuja Food Fest
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 12 }}>
                We bring the crowd — you bring the flavour. Every stop is built to put your business
                in front of real, hungry customers.
              </p>
              <div className="hero-ctas" style={{ marginTop: 22 }}>
                <a href="#vendor-form" className="btn btn-gold">
                  Register Now
                </a>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=700&auto=format&fit=crop"
              alt="Food vendor stall"
              style={{ borderRadius: "var(--radius-lg)", aspectRatio: "4/3", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      <section className="section--tight bg-cream2">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Benefits</span>
            <h2 style={{ fontSize: 28 }}>What You Get</h2>
          </div>
          <div className="grid grid-3">
            {[
              {
                ic: "👥",
                title: "Real Foot Traffic",
                body: "Thousands of students and festival-goers pass your stall each event.",
              },
              {
                ic: "📣",
                title: "Free Promotion",
                body: "Featured across our social pages and event materials.",
              },
              {
                ic: "🤝",
                title: "Vendor Community",
                body: "Network with other food businesses and future collaborators.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="benefit-row"
                style={{
                  border: "none",
                  background: "var(--white)",
                  borderRadius: "var(--radius-md)",
                  padding: 22,
                }}
              >
                <div className="ic">{b.ic}</div>
                <div>
                  <b>{b.title}</b>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>Vendor Packages</h2>
            <p>Choose the stall option that fits your business — pricing is per event stop.</p>
          </div>
          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            <div className="package-card">
              <b style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Single Campus Stall</b>
              <div className="price">
                <span>{fmtNaira(pricing.single)}</span> <span>/ stall</span>
              </div>
              <ul>
                <li>1 campus stop of your choice</li>
                <li>3×3 stall space provided</li>
                <li>Listed on event map</li>
                <li>Access to power outlet</li>
              </ul>
              <a href="#vendor-form" className="btn btn-outline btn-block">
                Select Package
              </a>
            </div>
            <div className="package-card highlight">
              <span className="ribbon">Best Value</span>
              <b style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Multi-Campus Stall</b>
              <div className="price">
                <span>{fmtNaira(pricing.multi)}</span> <span>/ stall</span>
              </div>
              <ul>
                <li>2 or more campus stops</li>
                <li>3×3 stall space at each stop</li>
                <li>Priority stall placement</li>
                <li>Featured in social shoutouts</li>
              </ul>
              <a href="#vendor-form" className="btn btn-primary btn-block">
                Select Package
              </a>
            </div>
            <div className="package-card">
              <b style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
                Flagship Festival Stall
              </b>
              <div className="price">
                <span>{fmtNaira(pricing.flagship)}</span> <span>/ event</span>
              </div>
              <ul>
                <li>Flagship festival at Jabi Lake</li>
                <li>5×5 premium stall space</li>
                <li>Menu board &amp; signage support</li>
                <li>Featured vendor spotlight</li>
              </ul>
              <a href="#vendor-form" className="btn btn-outline btn-block">
                Select Package
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight bg-cream2">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Available now</span>
            <h2 style={{ fontSize: 26 }}>Campus Tour Slots</h2>
          </div>
          <div className="slot-grid">
            {SLOTS.map((s) => (
              <div key={s.name} className="slot-chip">
                <b>{s.name}</b>
                <span>{s.date}</span>
                <div className="avail">{s.left} slots left</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="vendor-form">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Register</span>
            <h2>Vendor Registration Form</h2>
          </div>
          <VendorForm pricing={pricing} />
        </div>
      </section>
    </>
  );
}
