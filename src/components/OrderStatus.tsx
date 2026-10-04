"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config, ngn } from "@/config";
import { rememberOrder } from "@/lib/useLocal";
import type { PublicOrder } from "@/lib/publicOrder";

export function OrderStatus({ id }: { id: string }) {
  const [o, setO] = useState<PublicOrder | null>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let on = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/orders/${id}`);
        if (!on) return;
        if (r.ok) {
          const data = await r.json();
          setO(data);
          rememberOrder(id);
        } else {
          setMissing(true);
        }
      } catch {
        // Silently swallow fetch errors during network fluctuations
      }
    };
    tick();
    const t = setInterval(tick, 2000);
    return () => {
      on = false;
      clearInterval(t);
    };
  }, [id]);

  function copyOrderId() {
    if (!o?.id) return;
    navigator.clipboard?.writeText(o.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (missing) {
    return (
      <div className="max-w-lg mx-auto my-12 rounded-3xl border border-white/10 bg-card/70 p-8 text-center backdrop-blur-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl mx-auto">
          🔍
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Order Not Found</h1>
        <p className="mt-2 text-sm text-mute">
          We couldn&apos;t locate an order with reference <span className="font-mono text-white font-semibold">{id}</span>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/track-order"
            className="rounded-xl border border-white/10 bg-bg2 px-5 py-2.5 text-xs font-semibold text-white hover:border-brand transition"
          >
            Search Again
          </Link>
          <a
            href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello, I cannot find my order reference: ${id}`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
          >
            Ask WhatsApp Support
          </a>
        </div>
      </div>
    );
  }

  if (!o) {
    return (
      <div className="max-w-2xl mx-auto my-8 space-y-6 animate-pulse">
        <div className="h-48 rounded-3xl bg-card/50 border border-white/5" />
        <div className="h-64 rounded-3xl bg-card/50 border border-white/5" />
      </div>
    );
  }

  const done = o.fulfillment === "SUCCESSFUL";
  const review = o.fulfillment === "PENDING_REVIEW";
  const failed = o.payment === "PAYMENT_FAILED" || o.fulfillment === "FAILED";
  const refunded = o.payment === "REFUNDED";

  const statusTitle = done
    ? "Top-Up Successful"
    : refunded
    ? "Refund Processed"
    : failed
    ? o.payment === "PAYMENT_FAILED"
      ? "Payment Failed"
      : "Delivery Disruption"
    : review
    ? "Verifying In-Game Delivery"
    : "Processing Your Credits…";

  const statusMsg = done
    ? `Your ${o.productName} has been delivered directly to your Player account.`
    : review
    ? "Payment confirmed. Top-up is being queued with the official publisher API. Your money is 100% safe."
    : failed && o.payment === "PAID"
    ? "Payment received, but automated delivery faced an unexpected delay. Your funds are protected. Our desk is on it."
    : o.payment === "PAYMENT_FAILED"
    ? "Your transaction did not complete. No funds were debited from your bank account."
    : "Waiting for network confirmation. Diamonds and game credits usually reflect in ~24s.";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tactical Status Banner Card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div
          className={`pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full blur-[90px] ${
            done
              ? "bg-emerald-500/20"
              : review
              ? "bg-amber-500/20"
              : failed
              ? "bg-red-500/20"
              : "bg-brand/20"
          }`}
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  done
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : review
                    ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                    : failed
                    ? "border border-red-500/30 bg-red-500/10 text-red-400"
                    : "border border-brand/40 bg-brand/10 text-hi"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    done
                      ? "bg-emerald-400"
                      : review
                      ? "bg-amber-400 animate-pulse"
                      : failed
                      ? "bg-red-400"
                      : "bg-brand animate-ping"
                  }`}
                />
                {o.fulfillment === "NOT_STARTED" ? o.payment : o.fulfillment}
              </span>
              <span className="text-xs text-mute font-mono">
                {o.createdAt.slice(0, 16).replace("T", " ")}
              </span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {statusTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink2 leading-relaxed">
              {statusMsg}
            </p>
          </div>

          {/* Reference copy button */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-mute">
              Order Ref
            </span>
            <button
              type="button"
              onClick={copyOrderId}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-bg2/80 px-3 py-1.5 text-xs font-mono font-bold text-white transition hover:border-brand/40 active:scale-95"
              title="Click to copy Order ID"
            >
              <span>{o.id}</span>
              <span className="text-[10px] text-mute">{copied ? "✓" : "📋"}</span>
            </button>
            {copied && (
              <span className="text-[10px] text-emerald-400 font-medium">
                Copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Milestone Events Timeline */}
        <div className="py-6 border-b border-white/5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mute">
            Delivery Timeline
          </h3>
          <ol className="space-y-2.5 text-xs">
            {o.events.map((e, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[10px] font-bold text-hi">
                  ✓
                </span>
                <span className="text-white font-medium">{e.label}</span>
                <span className="text-[11px] text-mute ml-auto font-mono">
                  {e.at.slice(11, 19)}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Digital Receipt Specs */}
        <div className="pt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mute">
            Order Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-bg2/60 p-3 border border-white/5">
              <span className="text-mute block text-[11px]">Game Title</span>
              <span className="font-bold text-white text-sm">{o.gameName || "—"}</span>
            </div>
            <div className="rounded-2xl bg-bg2/60 p-3 border border-white/5">
              <span className="text-mute block text-[11px]">Denomination Package</span>
              <span className="font-bold text-hi text-sm">{o.productName || "—"}</span>
            </div>
            {Object.entries(o.playerFields).map(([label, val]) => (
              <div key={label} className="rounded-2xl bg-bg2/60 p-3 border border-white/5">
                <span className="text-mute block text-[11px]">Player ID / UID</span>
                <span className="font-mono font-bold text-white text-sm tracking-wider">
                  {val}
                </span>
              </div>
            ))}
            <div className="rounded-2xl bg-bg2/60 p-3 border border-white/5">
              <span className="text-mute block text-[11px]">Amount Charged</span>
              <span className="font-extrabold text-white text-base">
                {ngn(o.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
          {o.gameSlug && (
            <Link
              href={`/games/${o.gameSlug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand2 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand/25 transition hover:brightness-110 active:scale-95"
            >
              <span>⚡ Top Up Again</span>
            </Link>
          )}

          <a
            href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hello Zenaload Support, my order reference is: ${o.id}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-bg2 px-5 py-2.5 text-xs font-semibold text-white transition hover:border-emerald-500/50 hover:text-emerald-400"
          >
            <span>💬 Message Support Desk</span>
          </a>

          <Link
            href="/track-order"
            className="text-xs text-mute hover:text-white transition ml-auto"
          >
            Track another order &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
