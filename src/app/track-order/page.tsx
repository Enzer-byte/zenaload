"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { config } from "@/config";
import { useLocal } from "@/lib/useLocal";

export default function TrackOrderPage() {
  const [id, setId] = useState("");
  const router = useRouter();
  const [recentOrders, , ready] = useLocal<string[]>("zl_orders", []);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (id.trim()) {
      router.push(`/orders/${id.trim().toUpperCase()}`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      {/* Header section */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-hi">
          <span className="h-1.5 w-1.5 rounded-full bg-hi animate-pulse" />
          Live Order Tracker
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Track Your Top-Up
        </h1>
        <p className="text-sm text-mute max-w-md mx-auto">
          Enter your Order ID (starts with <span className="font-mono text-white font-semibold">{config.orderPrefix}</span>) to view real-time delivery status and receipts.
        </p>
      </div>

      {/* Tactical Lookup Card */}
      <div className="rounded-3xl border border-white/10 bg-card/75 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink2 mb-2">
              Order Reference ID
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-mute">
                🔍
              </span>
              <input
                type="text"
                required
                aria-label="Order ID"
                placeholder={`${config.orderPrefix}-20261004-9F3A1C7E`}
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-bg2/90 pl-11 pr-4 py-4 font-mono text-sm text-white placeholder-mute transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand uppercase"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-mute">
              Found in your email receipt or payment confirmation screen.
            </p>
          </div>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand2 py-4 px-6 text-sm font-bold text-white shadow-xl shadow-brand/25 transition-all hover:brightness-110 active:scale-95"
          >
            <span>Track Order Now</span>
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        </form>

        {/* Recent Orders on Device */}
        {ready && recentOrders.length > 0 && (
          <div className="mt-8 border-t border-white/5 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mute mb-3">
              Recent Orders on This Device
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentOrders.slice(0, 5).map((orderId) => (
                <button
                  key={orderId}
                  type="button"
                  onClick={() => router.push(`/orders/${orderId}`)}
                  className="rounded-xl border border-white/10 bg-bg2/60 px-3.5 py-1.5 font-mono text-xs text-ink2 transition hover:border-brand/40 hover:text-white"
                >
                  {orderId}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trust & Help Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card/40 p-5 text-left backdrop-blur-sm">
          <div className="text-xl mb-2">⚡</div>
          <h4 className="text-sm font-bold text-white">Instant Fulfillment</h4>
          <p className="text-xs text-mute mt-1">
            Over 95% of top-ups complete in under 60 seconds automatically.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card/40 p-5 text-left backdrop-blur-sm">
          <div className="text-xl mb-2">🛡️</div>
          <h4 className="text-sm font-bold text-white">100% Safe Delivery</h4>
          <p className="text-xs text-mute mt-1">
            If an order cannot be completed by publisher APIs, we issue a prompt refund.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card/40 p-5 text-left backdrop-blur-sm">
          <div className="text-xl mb-2">💬</div>
          <h4 className="text-sm font-bold text-white">Live Support Desk</h4>
          <p className="text-xs text-mute mt-1">
            Need urgent assistance?{" "}
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-hi hover:underline"
            >
              Chat on WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
