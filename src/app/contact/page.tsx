import { PageBanner } from "@/components/PageBanner";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <PageBanner
        breadcrumb="Contact"
        eyebrow="We'd love to hear from you"
        title="Get in Touch"
        description="Questions about tickets, vendor slots or partnerships? Reach out — our team replies within 24 hours."
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <ContactForm />
            </div>

            <div>
              <div className="contact-card">
                <div className="ic">📍</div>
                <div>
                  <b>Our Location</b>
                  <p style={{ color: "var(--ink-soft)", fontSize: 14.5, marginTop: 4 }}>
                    Abuja, Federal Capital Territory, Nigeria
                  </p>
                </div>
              </div>
              <div className="contact-card">
                <div className="ic">✉️</div>
                <div>
                  <b>Email Us</b>
                  <p style={{ color: "var(--ink-soft)", fontSize: 14.5, marginTop: 4 }}>
                    contactabujafoodfest@gmail.com
                  </p>
                </div>
              </div>
              <div className="contact-card">
                <div className="ic">📞</div>
                <div>
                  <b>Call / WhatsApp</b>
                  <p style={{ color: "var(--ink-soft)", fontSize: 14.5, marginTop: 4 }}>
                    0813 652 8807
                  </p>
                </div>
              </div>
              <div className="contact-card" style={{ alignItems: "center" }}>
                <div className="ic">📱</div>
                <div>
                  <b>Follow Us</b>
                  <div className="footer-social" style={{ marginTop: 10 }}>
                    <a
                      href="#"
                      style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                      aria-label="Instagram"
                    >
                      IG
                    </a>
                    <a
                      href="#"
                      style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                      aria-label="X / Twitter"
                    >
                      X
                    </a>
                    <a
                      href="#"
                      style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                      aria-label="TikTok"
                    >
                      TT
                    </a>
                  </div>
                </div>
              </div>
              <div className="map-box">Map preview — Abuja, FCT</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
