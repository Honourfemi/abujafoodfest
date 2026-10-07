"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;

    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (done) {
    return (
      <p style={{ color: "var(--gold)", fontWeight: 600 }}>
        You&apos;re on the list — thanks for subscribing!
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="email"
        placeholder="Enter your email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={pending}
      />
      <button className="btn btn-gold" type="submit" disabled={pending}>
        {pending ? "…" : "Subscribe"}
      </button>
      {error && (
        <p style={{ color: "var(--gold)", fontSize: 13, width: "100%", marginTop: 6 }}>
          {error}
        </p>
      )}
    </form>
  );
}
