"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { config, ngn } from "@/config";
import { rememberOrder } from "@/lib/useLocal";
import type { PublicOrder } from "@/lib/publicOrder";
export function OrderStatus({ id }: { id: string }) {
  const [o, setO] = useState<PublicOrder | null>(null), [missing, setMissing] = useState(false);
  useEffect(() => { let on = true; const tick = async () => { try { const r = await fetch(`/api/orders/${id}`); if (!on) return; if (r.ok) { setO(await r.json()); rememberOrder(id); } else setMissing(true); } catch {} }; tick(); const t = setInterval(tick, 1500); return () => { on = false; clearInterval(t); }; }, [id]);
  if (missing) return <p>We couldn't find that order. Check the Order ID and try again.</p>;
  if (!o) return <div className="h-40 animate-pulse rounded-2xl bg-card" aria-label="Loading your order" />;
  const done = o.fulfillment === "SUCCESSFUL", review = o.fulfillment === "PENDING_REVIEW", failed = o.payment === "PAYMENT_FAILED" || o.fulfillment === "FAILED", refunded = o.payment === "REFUNDED";
  const title = done ? "Top-Up Successful" : refunded ? "Refund processed" : failed ? (o.payment === "PAYMENT_FAILED" ? "Payment failed" : "Top-up couldn't be completed") : review ? "Top-up is taking longer than expected" : "Processing your order…";
  const msg = done ? `Your ${o.productName} have been delivered.` : review ? "Payment received, but your top-up is taking longer than expected. Your order is safe. We're checking the delivery status." : failed && o.payment === "PAID" ? "Your payment is safe. Contact support and we'll deliver the top-up or refund you." : o.payment === "PAYMENT_FAILED" ? "Your payment didn't go through. You have not been charged." : "";
  const row = (l: string, v: string) => <div className="flex justify-between border-b border-line py-2 text-sm"><span className="text-ink2">{l}</span><span>{v}</span></div>;
  return (<div className="max-w-xl rounded-2xl border border-line bg-card p-6"><h1 className={`text-2xl font-semibold ${done ? "text-green-400" : ""}`}>{title}</h1>{msg && <p className="mt-1 text-ink2">{msg}</p>}<ul className="my-4 space-y-1 text-sm text-ink2" aria-label="Order progress">{o.events.map((e, i) => <li key={i}>✓ {e.label}</li>)}</ul>
  {row("Order ID", o.id)}{row("Game", o.gameName ?? "")}{row("Product", o.productName ?? "")}{Object.entries(o.playerFields).map(([k, v]) => row("Player ID", v))}{row("Amount", ngn(o.amount))}{row("Date", o.createdAt.slice(0, 16).replace("T", " "))}{row("Status", `${o.payment} / ${o.fulfillment}`)}
  {o.errorMessage && <p className="mt-2 text-sm text-amber-400">{o.errorMessage}</p>}<div className="mt-5 flex flex-wrap gap-3">{o.gameSlug && <Link href={`/games/${o.gameSlug}`} className="rounded-xl bg-brand px-5 py-2.5">Buy Again</Link>}<a href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Order " + o.id)}`} className="rounded-xl border border-line px-5 py-2.5">Contact Support</a></div></div>);
}
