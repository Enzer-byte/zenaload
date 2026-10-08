"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { config, ngn } from "@/config";

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
  const [waUpdates, setWaUpdates] = useState(true);
  const [paymentChannel, setPaymentChannel] = useState<"bank" | "card" | "ussd">("bank");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const firstUid = summary.ids[0]?.value || "";

  async function handlePay() {
    setErr("");
    const cleanedPhone = phone.replace(/\s/g, "");
    if (!/^\S+@\S+\.\S+$/.test(email) || !/^(\+234|0)[789]\d{9}$/.test(cleanedPhone)) {
      return setErr("Enter a valid email address and a Nigerian phone number (e.g. 08012345678).");
    }

    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          playerFields: fields,
          customer: {
            email,
            phone: cleanedPhone,
            whatsapp: waUpdates ? cleanedPhone : undefined,
          },
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

  if (busy) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-8 sm:p-12 text-center border border-outline-variant/30 card-elevation-2 max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
        </div>
        <h2 className="text-xl font-extrabold text-on-surface">Connecting to Paystack Gateway...</h2>
        <p className="text-xs text-outline leading-relaxed">
          Securing your checkout session. Please do not close or reload this window.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* LEFT COLUMN: Checkout Details Form (lg:col-span-7) */}
      <section className="lg:col-span-7 space-y-5">
        {/* Step 1: Contact Information Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 md:p-6 border border-surface-variant card-elevation-1">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-surface-variant/50">
            <div className="w-7 h-7 rounded-full bg-primary text-surface-container-lowest flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">Contact Information</h2>
              <p className="text-xs text-outline">Order receipt, confirmation, and status notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="checkout-email">
                Email Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for delivery receipt"
                  className="block w-full h-[52px] pl-11 pr-4 rounded-xl border border-surface-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none"
                />
              </div>
              <p className="text-xs text-outline mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                Your digital payment receipt and order reference will be sent here
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="checkout-phone">
                Nigerian Phone Number <span className="text-error">*</span>
              </label>
              <div className="flex rounded-xl shadow-xs">
                <div className="inline-flex items-center gap-1.5 px-3.5 bg-surface-container-low border border-r-0 border-surface-variant rounded-l-xl text-xs font-bold text-on-surface select-none">
                  <span>🇳🇬</span>
                  <span>+234</span>
                </div>
                <div className="relative flex-grow">
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="block w-full h-[52px] px-4 rounded-r-xl border border-surface-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary pointer-events-none">
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Notification Toggle */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/60 border border-surface-variant cursor-pointer hover:bg-surface-container-low transition-colors">
                <input
                  type="checkbox"
                  checked={waUpdates}
                  onChange={(e) => setWaUpdates(e.target.checked)}
                  className="w-5 h-5 rounded-md border-surface-variant text-primary focus:ring-primary-container mt-0.5"
                />
                <div className="flex-grow">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg text-emerald-600">chat</span>
                    <span className="text-xs font-bold text-on-surface">Send instant delivery updates and order status on WhatsApp</span>
                  </div>
                  <p className="text-xs text-outline mt-0.5">Receive automated message when your credits reflect in-game</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Step 2: Payment Method Selection */}
        <div className="bg-surface-container-lowest rounded-xl p-5 md:p-6 border border-surface-variant card-elevation-1">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary text-surface-container-lowest flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">Payment Method</h2>
                <p className="text-xs text-outline">Fast settlement via Paystack payment rails</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container text-xs text-on-surface-variant border border-surface-variant">
              <span>Secured by</span>
              <strong className="text-on-surface tracking-wide">paystack</strong>
            </div>
          </div>

          <div className="space-y-3">
            {/* Option 1: Bank Transfer */}
            <label
              onClick={() => setPaymentChannel("bank")}
              className={`block relative rounded-xl p-4 cursor-pointer transition-all ${
                paymentChannel === "bank"
                  ? "border-2 border-primary-container bg-surface-container-lowest shadow-md"
                  : "border border-surface-variant hover:border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment_channel"
                    checked={paymentChannel === "bank"}
                    onChange={() => setPaymentChannel("bank")}
                    className="w-5 h-5 text-primary-container focus:ring-primary-container mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-on-surface">Bank Transfer</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-secondary-container/20 text-on-secondary-container">
                        FASTEST &bull; RECOMMENDED
                      </span>
                    </div>
                    <p className="text-xs text-outline mt-1">Automated virtual account via Paystack. Confirms in ~10 seconds without card OTP delays.</p>
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-surface-variant text-[11px] font-bold rounded">Kuda</span>
                      <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-surface-variant text-[11px] font-bold rounded">GTBank</span>
                      <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-surface-variant text-[11px] font-bold rounded">Zenith</span>
                      <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-surface-variant text-[11px] font-bold rounded">OPay</span>
                      <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-surface-variant text-[11px] font-bold rounded">PalmPay</span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary-container">account_balance</span>
              </div>
            </label>

            {/* Option 2: Debit Card */}
            <label
              onClick={() => setPaymentChannel("card")}
              className={`block relative rounded-xl p-4 cursor-pointer transition-all ${
                paymentChannel === "card"
                  ? "border-2 border-primary-container bg-surface-container-lowest shadow-md"
                  : "border border-surface-variant hover:border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment_channel"
                    checked={paymentChannel === "card"}
                    onChange={() => setPaymentChannel("card")}
                    className="w-5 h-5 text-primary-container focus:ring-primary-container mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-bold text-on-surface">Debit / Credit Card</span>
                    <p className="text-xs text-outline mt-0.5">Instant processing for Verve, Mastercard, and Visa issued by Nigerian banks.</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 bg-surface-container-low text-outline text-[11px] font-bold rounded border border-surface-variant">Mastercard</span>
                      <span className="px-2 py-0.5 bg-surface-container-low text-outline text-[11px] font-bold rounded border border-surface-variant">Visa</span>
                      <span className="px-2 py-0.5 bg-surface-container-low text-outline text-[11px] font-bold rounded border border-surface-variant">Verve</span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">credit_card</span>
              </div>
            </label>

            {/* Option 3: USSD */}
            <label
              onClick={() => setPaymentChannel("ussd")}
              className={`block relative rounded-xl p-4 cursor-pointer transition-all ${
                paymentChannel === "ussd"
                  ? "border-2 border-primary-container bg-surface-container-lowest shadow-md"
                  : "border border-surface-variant hover:border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment_channel"
                    checked={paymentChannel === "ussd"}
                    onChange={() => setPaymentChannel("ussd")}
                    className="w-5 h-5 text-primary-container focus:ring-primary-container mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-on-surface">USSD / Bank Code</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant">Low Data</span>
                    </div>
                    <p className="text-xs text-outline mt-0.5">Dial direct codes: GTB *737#, Zenith *966#, UBA *919#, FirstBank *894#.</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">dialpad</span>
              </div>
            </label>
          </div>
        </div>

        {/* Step 3: Irreversible Notice & CTA Button */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-700 mt-0.5 text-xl">warning</span>
            <div>
              <p className="text-xs font-bold text-amber-900">Irreversible Delivery Notice</p>
              <p className="text-xs text-amber-800 mt-0.5">
                In-game credits are dispatched directly to UID <strong className="font-bold text-amber-950">{firstUid}</strong> within ~24s after payment. Top-ups cannot be reversed or transferred once delivered.
              </p>
            </div>
          </div>

          {err && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-semibold rounded-xl">
              {err}
            </div>
          )}

          {/* Primary Pay CTA Button with exact electric gradient */}
          <button
            type="button"
            onClick={handlePay}
            className="w-full min-h-[54px] rounded-xl text-surface-container-lowest text-base font-extrabold flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer px-6 bg-electric-gradient brand-glow shadow-lg"
          >
            <span className="material-symbols-outlined text-xl">lock</span>
            <span>Proceed to pay {ngn(summary.amount)} &rarr;</span>
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/70">
              <span className="material-symbols-outlined text-primary text-lg">verified</span>
              <p className="text-xs font-bold text-on-surface mt-1">Paystack Verified</p>
              <p className="text-[10px] text-outline">Tier-1 Merchant</p>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/70">
              <span className="material-symbols-outlined text-primary text-lg">shield</span>
              <p className="text-xs font-bold text-on-surface mt-1">Bank Grade</p>
              <p className="text-[10px] text-outline">256-bit SSL Data</p>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/70">
              <span className="material-symbols-outlined text-primary text-lg">credit_card_off</span>
              <p className="text-xs font-bold text-on-surface mt-1">Zero Card Storage</p>
              <p className="text-[10px] text-outline">Zero liability risk</p>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/70">
              <span className="material-symbols-outlined text-primary text-lg">currency_exchange</span>
              <p className="text-xs font-bold text-on-surface mt-1">Money-Back</p>
              <p className="text-[10px] text-outline">If undelivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Order Summary Card (lg:col-span-5, sticky) verbatim from Stitch */}
      <aside className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
        <div className="bg-surface-container-lowest rounded-xl p-5 md:p-6 border border-surface-variant card-elevation-1">
          <div className="flex items-center justify-between pb-4 border-b border-surface-variant">
            <div>
              <h2 className="text-base font-bold text-on-surface">Order Summary</h2>
              <span className="text-[11px] text-outline">Guest Top-Up</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary-container/15 text-on-secondary-container text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              Live Queue
            </span>
          </div>

          {/* Game Item Header Card */}
          <div className="flex items-center gap-3.5 my-4 p-3 bg-surface-container-low rounded-xl border border-surface-variant">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-surface-container-lowest text-lg font-extrabold shadow-sm shrink-0">
              {summary.game.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-grow">
              <h3 className="text-xs font-bold text-on-surface truncate">{summary.game}</h3>
              <p className="text-[11px] text-outline flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-xs">public</span>
                <span>Server: Nigeria / SSA</span>
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-surface-variant/40">
              <span className="text-outline">Player ID (UID)</span>
              <div className="text-right">
                <div className="flex items-center gap-1 font-bold text-on-surface">
                  <span>{firstUid || "—"}</span>
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-surface-variant/40">
              <span className="text-outline">Selected Package</span>
              <div className="text-right font-bold text-on-surface">
                <span>{summary.product}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-surface-variant/40">
              <span className="text-outline">Delivery Method</span>
              <span className="font-semibold text-on-surface">Direct automated API link (~24s)</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-surface-variant/40">
              <span className="text-outline">Subtotal</span>
              <span className="font-semibold text-on-surface">{ngn(summary.amount)}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-surface-variant/40">
              <span className="text-outline">Payment Processing Fee</span>
              <span className="font-bold text-emerald-600">₦0.00 (FREE)</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-surface-variant flex items-baseline justify-between">
            <span className="text-sm font-bold text-on-surface">Total Payable</span>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-on-surface tracking-tight">
                {ngn(summary.amount)}
              </span>
              <span className="block text-[10px] text-outline">Guaranteed 100% in-game credit</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Help Desk Card */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">support_agent</span>
            <div>
              <p className="text-xs font-bold text-on-surface">Need help before paying?</p>
              <p className="text-[11px] text-outline">Chat with our Lagos support desk</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${config.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs font-bold text-on-surface hover:border-primary transition-colors whitespace-nowrap shadow-xs"
          >
            Chat Now
          </a>
        </div>
      </aside>
    </div>
  );
}
