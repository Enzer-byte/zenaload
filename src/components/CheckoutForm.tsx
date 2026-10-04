"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ngn } from "@/config";

export function CheckoutForm({
  productId,
  fields,
  summary,
}: {
  productId: string;
  fields: Record<string, string>;
  summary: {
    game: string;
    product: string;
    amount: number;
    originalAmount?: number;
    ids: { label: string; value: string }[];
  };
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wa, setWa] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function pay() {
    setErr("");
    const cleanedPhone = phone.replace(/\s/g, "");
    if (!/^\S+@\S+\.\S+$/.test(email) || !/^(\+234|0)[789]\d{9}$/.test(cleanedPhone)) {
      return setErr("Enter a valid email and a Nigerian phone number (e.g. 08030000000 or +2348030000000).");
    }

    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          playerFields: fields,
          customer: { email, phone: cleanedPhone, whatsapp: wa ? wa.replace(/\s/g, "") : undefined },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize order.");

      if (data.paymentUrl) {
        window.location.assign(data.paymentUrl);
      } else {
        router.push(`/orders/${data.id}`);
      }
    } catch (e) {
      setBusy(false);
      setErr(e instanceof Error && e.message ? e.message : "Network problem. Please check your connection and try again.");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-bg2 px-4 py-3 text-sm text-white placeholder-mute transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  if (busy) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-card p-8 sm:p-12 text-center shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />
        <div className="relative z-10 mx-auto max-w-md space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/40 bg-brand/10">
            <span className="h-6 w-6 animate-spin rounded-full border-3 border-brand/30 border-t-hi" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Preparing Secure Checkout</h1>
          <p className="text-sm text-ink2">
            Connecting to Paystack gateway... Please don&apos;t close or refresh this tab.
          </p>
        </div>
      </div>
    );
  }

  const hasDiscount = !!summary.originalAmount && summary.originalAmount > summary.amount;
  const savings = hasDiscount ? summary.originalAmount! - summary.amount : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] items-start">
      {/* Left Column: Guest Checkout Form & Gateway Selection */}
      <div className="space-y-6 rounded-2xl border border-line bg-card p-6 sm:p-7 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-hi">
            Guest Checkout
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Customer Information
          </h1>
          <p className="mt-1 text-xs text-ink2">
            Your receipt and delivery notifications will be sent to these contact details.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="checkout-email" className="block text-xs font-semibold uppercase tracking-wider text-ink2">
              Email Address <span className="text-brand">*</span>
            </label>
            <input
              id="checkout-email"
              className={inputClass}
              type="email"
              autoComplete="email"
              placeholder="gamer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-mute">Instant purchase receipt and confirmation will be sent here.</p>
          </div>

          <div>
            <label htmlFor="checkout-phone" className="block text-xs font-semibold uppercase tracking-wider text-ink2">
              Nigerian Phone Number <span className="text-brand">*</span>
            </label>
            <input
              id="checkout-phone"
              className={inputClass}
              inputMode="tel"
              autoComplete="tel"
              placeholder="0803 000 0000 or +234..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-mute">Used for order tracking lookup and SMS updates if required.</p>
          </div>

          <div>
            <label htmlFor="checkout-wa" className="block text-xs font-semibold uppercase tracking-wider text-ink2">
              WhatsApp Number <span className="text-mute font-normal">(Optional)</span>
            </label>
            <input
              id="checkout-wa"
              className={inputClass}
              inputMode="tel"
              placeholder="Optional WhatsApp contact"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-mute">Allows 1-tap support lookup if delivery needs review.</p>
          </div>
        </div>

        {err && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-200">
            <span className="text-base leading-none">⚠️</span>
            <div className="flex-1 font-medium">{err}</div>
          </div>
        )}

        {/* Payment Gateways */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={pay}
            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand2 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:brightness-110 hover:shadow-brand/40 active:scale-[0.99]"
          >
            <span>💳 Pay with Paystack</span>
            <span className="text-white/60 text-xs">({ngn(summary.amount)})</span>
          </button>

          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-line bg-card/60 py-3.5 text-xs font-medium text-mute"
          >
            <span>Pay with Flutterwave (coming soon)</span>
          </button>
        </div>

        {/* Legal and Security Reassurance Badges */}
        <div className="space-y-3 border-t border-line/60 pt-4">
          <p className="text-[11px] text-ink2 leading-relaxed">
            By paying you agree to our{" "}
            <Link href="/terms" className="text-hi hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="text-hi hover:underline">
              Refund Policy
            </Link>
            . Read our{" "}
            <Link href="/privacy" className="text-hi hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="grid grid-cols-1 gap-2 rounded-xl border border-line/60 bg-elevated/40 p-3 text-[11px] text-mute sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🔒</span>
              <span>256-bit SSL encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🛡️</span>
              <span>Zero card data saved on our servers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary Receipt Card */}
      <div className="sticky top-20 rounded-2xl border border-line bg-card p-6 sm:p-7 shadow-lg">
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <h2 className="text-base font-bold text-white">Order Summary</h2>
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-hi">
            1 Item
          </span>
        </div>

        <dl className="mt-4 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <dt className="text-ink2">Game</dt>
            <dd className="font-semibold text-white">{summary.game}</dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-ink2">Package</dt>
            <dd className="font-semibold text-white">{summary.product}</dd>
          </div>

          {summary.ids.map((i) => (
            <div key={i.label} className="flex justify-between items-center rounded-lg bg-bg2/60 px-2.5 py-1.5">
              <dt className="text-mute">{i.label}</dt>
              <dd className="font-mono font-medium text-hi">{i.value}</dd>
            </div>
          ))}

          {hasDiscount && (
            <>
              <div className="flex justify-between items-center pt-2 text-mute">
                <dt>Original price</dt>
                <dd className="line-through">{ngn(summary.originalAmount!)}</dd>
              </div>
              <div className="flex justify-between items-center font-medium text-emerald-400">
                <dt className="flex items-center gap-1">
                  <span>Discount savings</span>
                </dt>
                <dd>-{ngn(savings)}</dd>
              </div>
            </>
          )}

          <div className="flex items-baseline justify-between border-t border-line/60 pt-3">
            <dt className="text-sm font-semibold text-white">Total due</dt>
            <dd className="text-xl font-black text-white">{ngn(summary.amount)}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-xl border border-brand/20 bg-brand/5 p-3 text-[11px] text-ink2">
          <p className="font-semibold text-hi">⚡ Instant In-Game Fulfillment</p>
          <p className="mt-0.5 text-mute">
            Top-up begins immediately after Paystack confirms payment. No waiting or manual voucher entry.
          </p>
        </div>
      </div>
    </div>
  );
}
