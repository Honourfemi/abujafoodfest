"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/actions";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@abujafoodfest.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await adminLogin(email, password);
      if (result.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="brand" style={{ justifyContent: "center", marginBottom: 8 }}>
          <span className="dot" />
          Abuja Food Fest
        </div>
        <h2>Admin Login</h2>
        <p>Sign in to manage events, orders, vendors and pricing.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p style={{ color: "var(--red)", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
              {error}
            </p>
          )}
          <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="admin-note">Default: admin@abujafoodfest.com / admin123</p>
      </div>
    </div>
  );
}
