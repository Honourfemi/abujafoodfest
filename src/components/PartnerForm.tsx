"use client";

import { useState, useTransition } from "react";
import { createContactMessage } from "@/lib/actions";

export function PartnerForm() {
  const [done, setDone] = useState(false);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState("Festival Partner");
  const [goals, setGoals] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!company.trim() || !contact.trim() || !email.trim()) {
      setError("Please fill in company name, contact person and email.");
      return;
    }

    const messageParts = [
      `Partnership enquiry from ${company.trim()}.`,
      `Contact: ${contact.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      `Interested tier: ${tier}`,
      goals.trim() ? `Goals: ${goals.trim()}` : null,
    ].filter(Boolean);

    startTransition(async () => {
      const result = await createContactMessage({
        name: contact.trim(),
        email,
        subject: `Partnership — ${company.trim()} (${tier})`,
        message: messageParts.join("\n"),
        enquiryType: "partnership",
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
      <div className="confirm-card" style={{ maxWidth: 520 }}>
        <div className="confirm-icon">✓</div>
        <h3>Enquiry Received!</h3>
        <p>
          Thanks, {contact}. We&apos;ll review {company}&apos;s partnership interest and reply to{" "}
          {email} within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form className="form-card" style={{ maxWidth: 640 }} onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label>Company Name</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Chivita Nigeria"
          />
        </div>
        <div className="field">
          <label>Contact Person</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Full name"
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
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
      </div>
      <div className="field">
        <label>Interested Tier</label>
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option>Community Partner</option>
          <option>Festival Partner</option>
          <option>Title Sponsor</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field">
        <label>Tell us about your goals</label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="What would you like to achieve through this partnership?"
        />
      </div>
      {error && (
        <p style={{ color: "var(--red)", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>
          {error}
        </p>
      )}
      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
