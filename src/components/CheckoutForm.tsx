"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ngn } from "@/config";
export function CheckoutForm({ productId, fields, summary }: { productId: string; fields: Record<string, string>; summary: { game: string; product: string; amount: number; ids: { label: string; value: string }[] } }) {
  const router = useRouter();
  const [email, setEmail] = useState(""), [phone, setPhone] = useState(""), [wa, setWa] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  async function pay() {
    setErr("");
    if (!/^\S+@\S+\.\S+$/.test(email) || !/^(\+234|0)[789]\d{9}$/.test(phone.replace(/\s/g, ""))) return setErr("Enter a valid email and a Nigerian phone number (e.g. 08030000000).");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", { method: "POST", body: JSON.stringify({ productId, playerFields: fields, customer: { email, phone: phone.replace(/\s/g, ""), whatsapp: wa || undefined } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.paymentUrl) window.location.assign(data.paymentUrl); else router.push(`/orders/${data.id}`); // paymentUrl = Paystack hosted page; none in mock mode
    } catch (e) { setBusy(false); setErr(e instanceof Error && e.message ? e.message : "Network problem. Please check your connection and try again."); }
  }
  const input = "mt-1 w-full rounded-xl border border-line bg-bg2 px-3 py-3";
  if (busy) return <div className="rounded-2xl border border-line bg-card p-8"><h1 className="text-2xl font-semibold">Processing your payment…</h1><p className="mt-2 text-ink2">Please don't close this page.</p></div>;
  return (<div className="grid gap-6 md:grid-cols-[1.4fr_1fr]"><div className="space-y-3 rounded-2xl border border-line bg-card p-5"><h1 className="text-2xl font-semibold">Checkout</h1>
  <label className="block text-sm text-ink2">Email<input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="block text-sm text-ink2">Phone number<input className={input} inputMode="tel" placeholder="08030000000" value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="block text-sm text-ink2">WhatsApp number (optional)<input className={input} inputMode="tel" value={wa} onChange={(e) => setWa(e.target.value)} /></label>
  {err && <p role="alert" className="text-sm text-red-500">{err}</p>}
  <p className="text-xs text-ink2">By paying you agree to our <Link href="/terms" className="text-hi underline">Terms</Link> and <Link href="/refund-policy" className="text-hi underline">Refund Policy</Link>. See our <Link href="/privacy" className="text-hi underline">Privacy Policy</Link>.</p><button onClick={pay} className="w-full rounded-xl bg-brand py-3 font-medium">Pay with Paystack</button><button disabled className="w-full rounded-xl border border-line py-3 text-mute">Pay with Flutterwave (coming soon)</button>
  <p className="text-xs text-mute">🔒 Your payment is securely processed. Your card details are handled by our payment provider and never touch our servers.</p></div>
  <div className="h-fit rounded-2xl border border-line bg-card p-5"><h2 className="mb-2 font-medium">Order summary</h2><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-ink2">Game</dt><dd>{summary.game}</dd></div><div className="flex justify-between"><dt className="text-ink2">Product</dt><dd>{summary.product}</dd></div>{summary.ids.map((i) => <div key={i.label} className="flex justify-between"><dt className="text-ink2">{i.label}</dt><dd>{i.value}</dd></div>)}<div className="flex justify-between border-t border-line pt-2 text-lg font-semibold"><dt>Total</dt><dd>{ngn(summary.amount)}</dd></div></dl></div></div>);
}
