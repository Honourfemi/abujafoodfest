import { getPartnerPricing } from "@/lib/queries";
import { fmtNaira } from "@/lib/format";
import { PageBanner } from "@/components/PageBanner";
import { PartnerForm } from "@/components/PartnerForm";

export const dynamic = "force-dynamic";

export default function PartnershipPage() {
  const pricing = await getPartnerPricing();

  return (
    <>
      <PageBanner
        breadcrumb="Partnerships"
        eyebrow="Partner With Us"
        title="Put Your Brand at the Heart of Abuja's Food Culture"
        description="We build partnerships that connect brands to a loyal, high-energy audience across campuses and citywide festivals."
      />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why partner with us</span>
            <h2>An Audience That Shows Up</h2>
          </div>
          <div className="grid grid-4 reach-grid">
            <div className="stat-block">
              <b>25K+</b>
              <span>Direct attendee reach per year</span>
            </div>
            <div className="stat-block">
              <b>5</b>
              <span>University campuses engaged</span>
            </div>
            <div className="stat-block">
              <b>120K+</b>
              <span>Combined social impressions</span>
            </div>
            <div className="stat-block">
              <b>18–30</b>
              <span>Core audience age range</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight bg-cream2">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What you get</span>
            <h2 style={{ fontSize: 28 }}>Brand Visibility Opportunities</h2>
          </div>
          <div className="grid grid-3">
            {[
              {
                ic: "🎪",
                title: "On-Ground Activations",
                body: "Branded booths, sampling stations and games at every event.",
              },
              {
                ic: "📱",
                title: "Digital Shoutouts",
                body: "Featured placement across our social media and website.",
              },
              {
                ic: "🎤",
                title: "Stage & Signage",
                body: "Logo placement on stage banners, wristbands and event signage.",
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
            <span className="eyebrow">Packages</span>
            <h2>Sponsorship Tiers</h2>
          </div>
          <div className="grid grid-3">
            <div className="partner-tier">
              <b className="tier-name">Community Partner</b>
              <div
                className="price"
                style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--red)" }}
              >
                {fmtNaira(pricing.community)}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 14.5,
                  color: "var(--ink-soft)",
                }}
              >
                <li>✓ Logo on event signage</li>
                <li>✓ Social media mention</li>
                <li>✓ 1 campus stop activation</li>
              </ul>
              <a href="#partner-form" className="btn btn-outline btn-block">
                Enquire
              </a>
            </div>
            <div className="partner-tier" style={{ borderColor: "var(--red)", boxShadow: "var(--shadow-pop)" }}>
              <span className="pill-tag" style={{ width: "fit-content" }}>
                Most Popular
              </span>
              <b className="tier-name">Festival Partner</b>
              <div
                className="price"
                style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--red)" }}
              >
                {fmtNaira(pricing.festival)}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 14.5,
                  color: "var(--ink-soft)",
                }}
              >
                <li>✓ Branded booth at flagship festival</li>
                <li>✓ Stage mentions &amp; banner placement</li>
                <li>✓ Full Campus Tour presence</li>
                <li>✓ Dedicated social content</li>
              </ul>
              <a href="#partner-form" className="btn btn-primary btn-block">
                Enquire
              </a>
            </div>
            <div className="partner-tier">
              <b className="tier-name">Title Sponsor</b>
              <div
                className="price"
                style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--red)" }}
              >
                {pricing.title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 14.5,
                  color: "var(--ink-soft)",
                }}
              >
                <li>✓ Co-branded event naming</li>
                <li>✓ Premium stage &amp; media placement</li>
                <li>✓ Year-round partnership benefits</li>
                <li>✓ First right of renewal</li>
              </ul>
              <a href="#partner-form" className="btn btn-outline btn-block">
                Talk to Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight bg-cream2">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Trusted by</span>
            <h2 style={{ fontSize: 26 }}>Previous Brand Partners</h2>
          </div>
          <div className="logo-wall">
            {["Chivita", "Coca-Cola", "Jumia", "MTN", "Chicken Republic", "Moniepoint", "Kwik", "Nova Bank"].map(
              (b) => (
                <div key={b} className="chip">
                  {b}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section" id="partner-form">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Get started</span>
            <h2>Partnership Inquiry Form</h2>
          </div>
          <PartnerForm />
        </div>
      </section>
    </>
  );
}
