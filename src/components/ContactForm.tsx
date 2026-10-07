"use client";

import { useState, useTransition } from "react";
import { createContactMessage } from "@/lib/actions";

const TABS = ["General Enquiry", "Vendor Enquiry", "Partnership Enquiry"] as const;

const TAB_TO_TYPE: Record<(typeof TABS)[number], string> = {
  "General Enquiry": "general",
  "Vendor Enquiry": "vendor",
  "Partnership Enquiry": "partnership",
};

export function ContactForm() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General Enquiry");
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    startTransition(async () => {
      const result = await createContactMessage({
        name,
        email,
        subject: subject.trim() || tab,
        message: phone.trim()
          ? `${message.trim()}\n\nPhone: ${phone.trim()}`
          : message.trim(),
        enquiryType: TAB_TO_TYPE[tab],
      });
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (done) {
    return (
      <div className="confirm-card" style={{ maxWidth: 480 }}>
        <div className="confirm-icon">✓</div>
        <h3>Message Sent!</h3>
        <p>
          Thanks, {name}. We received your {tab.toLowerCase()} and will reply to {email} within 24
          hours.
        </p>
      </div>
    );
  }

  return (
    <>
      <h3 style={{ fontSize: 22, marginBottom: 18 }}>Send Us a Message</h3>
      <div className="enquiry-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`enquiry-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="080X XXX XXXX"
          />
        </div>
        <div className="field">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
          />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more..."
          />
        </div>
        {error && (
          <p style={{ color: "var(--red)", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>
            {error}
          </p>
        )}
        <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send Message"}
        </button>
      </form>
    </>
  );
}
