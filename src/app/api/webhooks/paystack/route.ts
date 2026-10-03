import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystackSignature";
import { handleChargeSuccess } from "@/services/paymentEvents";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const raw = await req.text(); // raw bytes: req.json() would break the signature
  if (!verifyPaystackSignature(raw, req.headers.get("x-paystack-signature"))) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  let evt: { event?: string; data?: { id?: number; reference?: string; amount?: number } };
  try { evt = JSON.parse(raw); } catch { return NextResponse.json({ error: "Bad payload" }, { status: 400 }); }
  if (evt.event !== "charge.success" || !evt.data?.reference) return NextResponse.json({ received: true, ignored: true });
  const result = await handleChargeSuccess(`${evt.event}:${evt.data.id ?? evt.data.reference}`, evt.data.reference, evt.data.amount);
  return NextResponse.json({ received: true, result }); // always 2xx for valid, handled events so the gateway stops retrying
}
