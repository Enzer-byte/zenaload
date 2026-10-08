"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Game, Product } from "@/types";
import { ngn } from "@/config";
import { PlayerIdGuideModal } from "@/components/PlayerIdGuideModal";

type PublicProduct = Omit<Product, "supplierCost" | "supplierProductId">;

export function TopupFormV2({
  game,
  products,
  initialId = "",
}: {
  game: Game;
  products: PublicProduct[];
  initialId?: string;
}) {
  const router = useRouter();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [paymentChannel, setPaymentChannel] = useState<"bank" | "card" | "ussd">("bank");
  const [err, setErr] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? products[0];

  useEffect(() => {
    const key = game.playerFields[0]?.key;
    if (!key) return;

    if (initialId) {
      setFields({ [key]: initialId });
      return;
    }

    try {
      const saved = localStorage.getItem(`zl_pid_${game.id}`);
      if (saved) setFields({ [key]: saved });
    } catch {}
  }, [game.id, game.playerFields, initialId]);

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErr("");
    try {
      if (value.trim()) localStorage.setItem(`zl_pid_${game.id}`, value.trim());
    } catch {}
  }

  function handleCheckout() {
    if (!selectedProduct) {
      setErr("Please select a top-up package.");
      return;
    }

    for (const f of game.playerFields) {
      const v = (fields[f.key] ?? "").trim();
      if (!v) {
        setErr(`Please enter your ${f.label}.`);
        return;
      }
    }

    const params = new URLSearchParams({ product: selectedProduct.id });
    for (const [k, v] of Object.entries(fields)) {
      if (v.trim()) params.set(`f_${k}`, v.trim());
    }
    router.push(`/checkout?${params.toString()}`);
  }

  const firstField = game.playerFields[0];
  const firstFieldValue = firstField ? fields[firstField.key] ?? "" : "";
  const isValidUid = firstFieldValue.trim().length >= 6;

  return (
    <div className="w-full">
      {/* GAME HEADER CARD verbatim from Stitch 93011b09c91a4cffaa7f7bce3c9c645d.html */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 border border-surface-variant card-elevation-1 mb-6 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Game Tile Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-md flex-shrink-0 text-white font-extrabold text-2xl tracking-tighter overflow-hidden">
              {game.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <span>{game.name.slice(0, 2).toUpperCase()}</span>
              )}
              <div className="absolute -top-1 -right-1 bg-surface-container-lowest rounded-full p-0.5 shadow">
                <span className="material-symbols-outlined text-amber-500 text-sm block">local_fire_department</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface">
                  {game.name}: Top-Up
                </h1>
                <span className="bg-secondary-container/15 text-secondary text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">bolt</span> Automated ~24s delivery
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Direct In-Game ID credit &bull; Instant activation &bull; Pay in Naira (₦) &bull; No password required
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs text-outline border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-between">
            <span className="flex items-center gap-1 text-on-surface-variant font-bold">
              <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span> Paystack-secured
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-base">api</span> Official publisher API
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-emerald-600 text-base">chat</span> 24/7 WhatsApp help
            </span>
          </div>
        </div>
      </section>

      {/* TOP-UP WORKFLOW GRID (Left: Steps 1, 2, 3; Right: Sticky Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* STEP 1: Enter Player ID */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-surface-variant card-elevation-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-on-surface">
                    Enter {game.playerFields.map((f) => f.label).join(" & ")}
                  </h2>
                  <p className="text-xs text-on-surface-variant">Find your UID in your in-game profile</p>
                </div>
              </div>

              {/* UID Guide Trigger */}
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="flex items-center gap-1 text-primary hover:text-tertiary text-xs font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-base">help_outline</span>
                <span className="hidden sm:inline">Where is my Player ID?</span>
                <span className="sm:hidden">Help</span>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {game.playerFields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-xl">badge</span>
                    </div>
                    <input
                      type="text"
                      placeholder={`Enter ${field.label}`}
                      value={fields[field.key] ?? ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full h-[52px] pl-11 pr-24 rounded-xl border-[1.5px] border-primary-container focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 text-on-surface text-base font-bold transition-all outline-none bg-surface-container-lowest"
                    />
                    <div className="absolute right-3 flex items-center gap-1.5">
                      {isValidUid && (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-md font-bold">
                          <span className="material-symbols-outlined text-sm font-bold">check_circle</span> Valid UID
                        </span>
                      )}
                    </div>
                  </div>
                  {field.help && <p className="text-xs text-outline">{field.help}</p>}
                </div>
              ))}

              <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
                <span>Account Server: <strong>Nigeria / Sub-Saharan Africa</strong></span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Publisher Gateway
                </span>
              </div>

              {/* Warning Notice verbatim from Stitch */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-700 text-xl flex-shrink-0">warning</span>
                <p className="text-xs text-amber-900 leading-snug">
                  <strong>Warning:</strong> Top-ups are applied instantly via automated publisher link and cannot be reversed or moved between Player IDs. Please double-check your UID.
                </p>
              </div>
            </div>
          </section>

          {/* STEP 2: Choose Package verbatim from Stitch 93011b09c91a4cffaa7f7bce3c9c645d.html */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-surface-variant card-elevation-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Choose Package</h2>
                  <p className="text-xs text-on-surface-variant">Instant in-game credit with 100% price protection</p>
                </div>
              </div>
              <span className="text-xs text-outline font-semibold">{products.length} options available</span>
            </div>

            {/* Package Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                const hasDiscount = !!p.originalPrice && p.originalPrice > p.retailPrice;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`relative rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] ${
                      isSelected
                        ? "bg-white border-2 border-primary-container shadow-md ring-2 ring-primary-container/20"
                        : "bg-surface-container-lowest border border-surface-variant hover:border-primary-container"
                    }`}
                  >
                    {/* Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center shadow">
                        <span className="material-symbols-outlined text-base font-bold">check</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`material-symbols-outlined text-2xl ${
                          isSelected ? "text-primary-container" : "text-secondary-container"
                        }`}
                      >
                        diamond
                      </span>
                      {hasDiscount ? (
                        <span className="bg-secondary-container/15 text-secondary text-[10px] px-1.5 py-0.5 rounded font-bold">
                          Save {ngn(p.originalPrice! - p.retailPrice)}
                        </span>
                      ) : p.popular ? (
                        <span className="bg-primary-container/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                          Most Popular
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <div className={`text-base font-extrabold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                        {p.denomination}
                      </div>
                      <div className="text-xs text-on-surface-variant font-medium">Credits</div>
                      <div className="mt-2 text-sm font-extrabold text-on-surface">{ngn(p.retailPrice)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 3: Payment Method Selector verbatim from Stitch 93011b09c91a4cffaa7f7bce3c9c645d.html */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-surface-variant card-elevation-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <div>
                <h2 className="text-base font-bold text-on-surface">Supported Payment Channels</h2>
                <p className="text-xs text-on-surface-variant">Instant fee-free reconciliation via Paystack Nigeria</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentChannel("bank")}
                className={`rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentChannel === "bank"
                    ? "border-2 border-primary-container bg-surface-container-low/40"
                    : "border border-surface-variant bg-surface-container-lowest hover:border-surface-variant"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest border border-surface-variant flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-bold text-on-surface">Bank Transfer</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">Fastest (Automated)</div>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-4 ${
                    paymentChannel === "bank" ? "border-primary-container bg-white" : "border-surface-variant"
                  }`}
                />
              </div>

              <div
                onClick={() => setPaymentChannel("card")}
                className={`rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentChannel === "card"
                    ? "border-2 border-primary-container bg-surface-container-low/40"
                    : "border border-surface-variant bg-surface-container-lowest hover:border-surface-variant"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-surface-variant flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-bold text-on-surface">Debit Cards</div>
                  <div className="text-[11px] text-on-surface-variant">Verve, Master, Visa</div>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-4 ${
                    paymentChannel === "card" ? "border-primary-container bg-white" : "border-surface-variant"
                  }`}
                />
              </div>

              <div
                onClick={() => setPaymentChannel("ussd")}
                className={`rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentChannel === "ussd"
                    ? "border-2 border-primary-container bg-surface-container-low/40"
                    : "border border-surface-variant bg-surface-container-lowest hover:border-surface-variant"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-surface-variant flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined">phone_android</span>
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-bold text-on-surface">USSD / Fintech</div>
                  <div className="text-[11px] text-on-surface-variant">All Nigerian Banks</div>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-4 ${
                    paymentChannel === "ussd" ? "border-primary-container bg-white" : "border-surface-variant"
                  }`}
                />
              </div>
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-surface-variant card-elevation-1">
            <h3 className="text-base font-extrabold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help</span> Frequently Asked Questions
            </h3>
            <div className="divide-y divide-outline-variant/20">
              <details className="py-3 group" open>
                <summary className="flex justify-between items-center cursor-pointer list-none text-xs font-bold text-on-surface">
                  <span>How fast will top-ups arrive in my game account?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Top-ups are dispatched automatically through our official publisher API link. In 99.4% of orders, credits reflect in your game inventory within <strong>24 seconds</strong> after payment confirmation.
                </p>
              </details>
              <details className="py-3 group">
                <summary className="flex justify-between items-center cursor-pointer list-none text-xs font-bold text-on-surface">
                  <span>What if I entered the wrong Player ID?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Because fulfillment is instantaneous and completely automated, top-ups executed to an existing valid UID cannot be reversed. Please verify your UID before checkout.
                </p>
              </details>
            </div>
          </section>
        </div>

        {/* DESKTOP STICKY SIDEBAR: Order Summary verbatim from Stitch 93011b09c91a4cffaa7f7bce3c9c645d.html */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-2 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <h3 className="text-base font-extrabold text-on-surface">Order Summary</h3>
              <span className="bg-secondary-container/15 text-secondary text-xs px-2 py-0.5 rounded-full font-bold">
                Direct Top-up
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Game Title</span>
                <span className="font-bold text-on-surface">{game.name}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Player ID / UID</span>
                <span className="font-bold text-on-surface font-mono bg-surface-container-low px-2 py-0.5 rounded">
                  {firstFieldValue || "Enter UID above"}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Selected Package</span>
                <span className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">diamond</span>
                  {selectedProduct?.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Estimated Delivery</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bolt</span> ~24 seconds
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Service Fee</span>
                <span className="font-bold text-emerald-600">FREE (₦0.00)</span>
              </div>
            </div>

            {err && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-semibold rounded-xl">
                {err}
              </div>
            )}

            {/* Total Calculation */}
            <div className="pt-3 border-t border-surface-variant flex justify-between items-baseline">
              <span className="text-sm font-bold text-on-surface">Total Payable</span>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-on-surface">
                  {selectedProduct ? ngn(selectedProduct.retailPrice) : "—"}
                </span>
                <span className="block text-[11px] text-outline">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Checkout CTA Button with exact electric gradient */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full min-h-[52px] bg-electric-gradient text-white rounded-xl text-base font-extrabold flex items-center justify-center gap-2 brand-glow hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
            >
              <span>Continue to checkout</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>

            {/* Security Footnotes verbatim from Stitch */}
            <div className="pt-2 flex flex-col items-center text-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-outline font-medium">
                <span className="material-symbols-outlined text-sm text-emerald-600">lock</span>
                256-bit encrypted &bull; Powered by Paystack
              </div>
              <div className="flex items-center gap-3 text-outline opacity-60 text-[10px] font-bold">
                <span>VERVE</span>
                <span>MASTERCARD</span>
                <span>VISA</span>
                <span>BANK TRANSFER</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MOBILE STICKY BOTTOM ACTION SHEET (< 768px) verbatim from Stitch 93011b09c91a4cffaa7f7bce3c9c645d.html */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-variant px-4 py-3 md:hidden shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
              <span>{selectedProduct?.denomination} Credits</span>
              <span>&bull;</span>
              <span className="font-mono text-outline">UID: {firstFieldValue.slice(0, 6) || "..."}</span>
            </div>
            <div className="text-lg font-extrabold text-on-surface">
              {selectedProduct ? ngn(selectedProduct.retailPrice) : "—"}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="flex-grow max-w-[210px] min-h-[48px] bg-electric-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 brand-glow active:scale-95 transition-transform"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>

      <PlayerIdGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        initialGameId={game.id}
      />
    </div>
  );
}
