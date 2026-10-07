import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        background: "#1A130D",
        color: "#D8CBB8",
        padding: "64px 0 28px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 36,
          }}
          className="footer-grid"
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                color: "var(--white)",
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              Abuja Food Fest
            </div>
            <p style={{ fontSize: 14.5, maxWidth: 280, marginBottom: 18 }}>
              Where food, culture and entertainment come together. Abuja&apos;s
              home for unforgettable food experiences.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="#" aria-label="Instagram" style={socialStyle}>IG</a>
              <a href="#" aria-label="X / Twitter" style={socialStyle}>X</a>
              <a href="#" aria-label="TikTok" style={socialStyle}>TT</a>
            </div>
          </div>

          <div>
            <h4 style={h4Style}>Explore</h4>
            <ul style={ulStyle}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={h4Style}>Quick Links</h4>
            <ul style={ulStyle}>
              <li><Link href="/tickets">Get Tickets</Link></li>
              <li><Link href="/vendor">Vendor Registration</Link></li>
              <li><Link href="/partnership">Partnership</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={h4Style}>Contact</h4>
            <ul style={ulStyle}>
              <li>contactabujafoodfest@gmail.com</li>
              <li>0813 652 8807</li>
              <li>Abuja, FCT, Nigeria</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: 48,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 13,
            color: "#9C8B72",
          }}
        >
          <span>© 2026 Abuja Food Fest. All rights reserved.</span>
          <span>
            Privacy Policy · Terms of Service ·{" "}
            <Link href="/admin/login" style={{ color: "#9C8B72" }}>
              Admin Login
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

const socialStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  color: "var(--white)",
};

const h4Style: React.CSSProperties = {
  color: "var(--white)",
  fontSize: 16,
  marginBottom: 16,
  fontFamily: "var(--font-display)",
};

const ulStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  fontSize: 14.5,
  color: "#C9BBA9",
};
