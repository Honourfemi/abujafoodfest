import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { queryOne } from "./db";
import type { AdminUser } from "@/types";

const COOKIE_NAME = "aff_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.AUTH_SECRET || "abuja-food-fest-dev-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const body = Buffer.from(JSON.stringify({ email, exp }), "utf8").toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

function decodeSession(token: string): { email: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      email: string;
      exp: number;
    };
    if (!data.email || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const data = decodeSession(token);
  if (!data) return null;
  return { email: data.email };
}

export async function requireAdmin(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const cleaned = email.trim().toLowerCase();
  if (!cleaned || !password) return null;
  const row = await queryOne<AdminUser>(
    "SELECT * FROM admin_users WHERE email = $1",
    [cleaned]
  );
  if (!row) return null;
  if (!bcrypt.compareSync(password, row.password_hash)) return null;
  return row;
}

export async function createSessionCookie(email: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, encodeSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
