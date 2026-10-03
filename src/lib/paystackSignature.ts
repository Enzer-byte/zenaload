import { createHmac, timingSafeEqual } from "crypto";
// Hash the RAW body (never re-serialised JSON) with HMAC-SHA512, compare in constant time.
export function verifyPaystackSignature(raw: string, signature: string | null, secret = process.env.PAYSTACK_API_KEY) {
  if (!signature || !secret) return false;
  const a = Buffer.from(createHmac("sha512", secret).update(raw).digest("hex")), b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
