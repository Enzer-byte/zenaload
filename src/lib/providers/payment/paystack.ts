import type { PaymentProvider } from "@/types";
import { UserFacingError } from "@/lib/errors";
import { verifyPaystackSignature } from "@/lib/paystackSignature";
import { config } from "@/config";
const BASE = "https://api.paystack.co";
// PLACEHOLDER GATE: real calls are blocked until PAYSTACK_API_KEY is a real sk_test_/sk_live_ key (see docs/PAYSTACK_SETUP.md).
export const isPaystackConfigured = () => /^sk_(test|live)_(?!REPLACE)\S{6,}$/.test(process.env.PAYSTACK_API_KEY ?? "");
async function call(path: string, init: RequestInit = {}) {
  if (!isPaystackConfigured()) throw new UserFacingError("Online payment isn't available yet. Please try again soon or contact support.");
  const res = await fetch(BASE + path, { ...init, headers: { Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`, "Content-Type": "application/json" } });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.status) throw new UserFacingError("We couldn't reach our payment provider. You have not been charged.");
  return json.data;
}
export const PaystackProvider: PaymentProvider = {
  id: "paystack",
  async initializePayment({ orderId, amount, email }) {
    const reference = `${orderId}-${Date.now().toString(36)}`; // unique per attempt
    const d = await call("/transaction/initialize", { method: "POST", body: JSON.stringify({ email, amount: amount * 100, currency: "NGN", reference, callback_url: `${config.appUrl}/orders/${orderId}`, metadata: { orderId } }) }); // amount in kobo
    return { reference: d.reference, status: "PENDING", redirectUrl: d.authorization_url };
  },
  async verifyPayment(ref) { return (await call(`/transaction/verify/${encodeURIComponent(ref)}`)).status === "success"; },
  async handleWebhook(payload, signature) { // payload = RAW request body string
    if (typeof payload !== "string" || !verifyPaystackSignature(payload, signature)) return null;
    const evt = JSON.parse(payload); return evt.event === "charge.success" ? { reference: evt.data.reference, paid: true } : null;
  },
  async refundPayment(ref) { await call("/refund", { method: "POST", body: JSON.stringify({ transaction: ref }) }); return true; },
  getTransaction: (ref) => call(`/transaction/verify/${encodeURIComponent(ref)}`),
};
