import { createHmac, timingSafeEqual } from "crypto";

// Shop2topup signs the raw request body with HMAC-SHA256
// Header format: X-Shop2Topup-Signature: sha256=<hex>
export function verifyShop2topupSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret = process.env.SHOP2TOPUP_WEBHOOK_SECRET
): boolean {
  if (!signatureHeader || !secret) return false;
  const hex = signatureHeader.startsWith("sha256=") ? signatureHeader.slice(7) : signatureHeader;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(hex);
  return a.length === b.length && timingSafeEqual(a, b);
}
