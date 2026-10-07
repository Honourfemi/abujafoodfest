/**
 * Paystack helpers (Phase 6 scaffolding).
 *
 * The original HTML only showed payment method chips (Card / Bank / USSD)
 * with no live gateway. Orders are stored with payment_status = 'pending'.
 *
 * To go live:
 * 1. Set PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env
 * 2. Call initializeTransaction from the ticket/vendor flow
 * 3. Redirect the user to authorization_url
 * 4. Verify on callback and update payment_status + paystack_reference
 *
 * Docs: https://paystack.com/docs/api/transaction/
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export function getPaystackPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() || null;
}

type InitResult =
  | { ok: true; authorization_url: string; access_code: string; reference: string }
  | { ok: false; error: string };

/** Initialize a Paystack transaction (amount in kobo). */
export async function initializeTransaction(opts: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}): Promise<InitResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, error: "Paystack is not configured (missing PAYSTACK_SECRET_KEY)." };
  }

  const amountKobo = Math.round(opts.amountNaira * 100);
  if (amountKobo < 100) {
    return { ok: false, error: "Amount too small for Paystack." };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: opts.email,
        amount: amountKobo,
        reference: opts.reference,
        currency: "NGN",
        callback_url: opts.callbackUrl,
        metadata: opts.metadata,
      }),
    });
    const data = (await res.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; access_code: string; reference: string };
    };
    if (!data.status || !data.data) {
      return { ok: false, error: data.message || "Paystack initialize failed." };
    }
    return {
      ok: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    };
  } catch (e) {
    console.error("initializeTransaction", e);
    return { ok: false, error: "Could not reach Paystack." };
  }
}

type VerifyResult =
  | { ok: true; status: string; amount: number; reference: string; paid: boolean }
  | { ok: false; error: string };

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return { ok: false, error: "Paystack is not configured." };
  }
  try {
    const res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      }
    );
    const data = (await res.json()) as {
      status: boolean;
      message?: string;
      data?: { status: string; amount: number; reference: string };
    };
    if (!data.status || !data.data) {
      return { ok: false, error: data.message || "Verify failed." };
    }
    return {
      ok: true,
      status: data.data.status,
      amount: data.data.amount / 100,
      reference: data.data.reference,
      paid: data.data.status === "success",
    };
  } catch (e) {
    console.error("verifyTransaction", e);
    return { ok: false, error: "Could not verify with Paystack." };
  }
}
