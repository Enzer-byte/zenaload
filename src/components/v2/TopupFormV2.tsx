"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Game, Product } from "@/types";
import { ngn } from "@/config";
import { PlayerIdGuideModal } from "@/components/PlayerIdGuideModal";
import { StickyMobileBarV2 } from "@/components/v2/StickyMobileBarV2";

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
  const [pid, setPid] = useState(products[0]?.id ?? "");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  // Initialize fields with initialId or retrieve from localStorage
  useEffect(() => {
    const key = game.playerFields[0]?.key;
    if (!key) return;

    if (initialId) {
      setFields({ [key]: initialId });
      return;
    }

    try {
      const saved = localStorage.getItem(`zl_pid_${game.id}`);
      if (saved) {
        setFields({ [key]: saved });
      }
    } catch {
      // Ignore localStorage errors (private browsing, etc.)
    }
  }, [game.id, game.playerFields, initialId]);

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErr("");

    try {
      if (value.trim()) {
        localStorage.setItem(`zl_pid_${game.id}`, value.trim());
      }
    } catch {
      // Ignore
    }
  }

  function handleBuy() {
    if (!pid) return setErr("Please select a top-up package to continue.");

    for (const f of game.playerFields) {
      const val = fields[f.key]?.trim() ?? "";
      if (!val) {
        return setErr(`Please enter your ${f.label}.`);
      }
      if (!new RegExp(f.pattern ?? ".+").test(val)) {
        return setErr(`Please enter a valid ${f.label}.`);
      }
    }

    const q = new URLSearchParams({ product: pid });
    game.playerFields.forEach((f) => q.set(`f_${f.key}`, fields[f.key]?.trim() ?? ""));
    router.push(`/checkout?${q}`);
  }

  const selected = products.find((p) => p.id === pid);
  const hasDiscount =
    selected &&
    typeof selected.originalPrice === "number" &&
    selected.originalPrice > selected.retailPrice;

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] pb-24 sm:pb-0">
        {/* Left Column: Denomination Packages & Player Fields */}
        <div className="space-y-8">
          {/* Section 1: Select Denomination Package */}
          <section aria-labelledby="packages-heading">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 id="packages-heading" className="text-lg font-bold text-white sm:text-xl">
                  1. Select Top-Up Package
                </h2>
                <p className="text-xs text-mute">Instant delivery to your player account.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-card px-2.5 py-1 text-xs text-ink2">
                {products.length} packages
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {products.map((p) => {
                const isSelected = pid === p.id;
                const disc =
                  typeof p.originalPrice === "number" && p.originalPrice > p.retailPrice
                    ? Math.round(((p.originalPrice - p.retailPrice) / p.originalPrice) * 100)
                    : 0;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPid(p.id)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-brand bg-elevated shadow-[0_0_20px_rgba(99,102,241,0.22)] ring-1 ring-brand"
                        : "border-white/10 bg-card/60 hover:border-white/20 hover:bg-card"
                    }`}
                  >
                    {disc > 0 && (
                      <span className="absolute right-2.5 top-2.5 rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400">
                        -{disc}%
                      </span>
                    )}

                    <div className="min-w-0 pr-6">
                      <div className="text-xs font-medium text-ink2 group-hover:text-white">
                        {p.denomination.toLocaleString("en-NG")} Credits
                      </div>
                      <div className="mt-1 text-sm font-bold text-white sm:text-base">
                        {p.name}
                      </div>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2 border-t border-white/5 pt-2">
                      <span className="text-sm font-extrabold text-hi sm:text-base">
                        {ngn(p.retailPrice)}
                      </span>
                      {p.originalPrice && p.originalPrice > p.retailPrice && (
                        <span className="text-xs text-mute line-through">
                          {ngn(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: Player Information Input */}
          <section aria-labelledby="player-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 id="player-heading" className="text-lg font-bold text-white sm:text-xl">
                  2. Enter Player Details
                </h2>
                <p className="text-xs text-mute">Your credits are delivered directly to this UID.</p>
              </div>

              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-hi transition hover:border-hi hover:bg-brand/20"
              >
                <span>💡 Where is my Player ID?</span>
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/70 p-5 backdrop-blur-sm sm:p-6">
              {game.playerFields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label htmlFor={`field-${f.key}`} className="block text-sm font-medium text-ink">
                    {f.label} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={`field-${f.key}`}
                      type="text"
                      className="w-full rounded-xl border border-white/10 bg-bg2 px-3.5 py-3 text-sm text-white placeholder-mute transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      placeholder={`Enter your ${f.label}`}
                      value={fields[f.key] ?? ""}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-mute">{f.help}</p>
                </div>
              ))}

              {err && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-400"
                >
                  {err}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="h-fit space-y-4">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-card/80 p-5 shadow-xl backdrop-blur-xl sm:p-6">
            <h3 className="text-base font-bold text-white sm:text-lg">Order Summary</h3>
            <p className="text-xs text-mute">Review and proceed with guest checkout.</p>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink2">Game</span>
                <span className="font-medium text-white">{game.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-ink2">Selected Package</span>
                <span className="font-medium text-white">{selected?.name ?? "—"}</span>
              </div>

              {game.playerFields.map((f) => (
                <div key={f.key} className="flex justify-between">
                  <span className="text-ink2">{f.label}</span>
                  <span className="font-mono text-xs font-medium text-white">
                    {fields[f.key] ? fields[f.key] : <span className="text-mute italic">Not entered</span>}
                  </span>
                </div>
              ))}

              {hasDiscount && (
                <>
                  <div className="flex justify-between text-xs text-mute">
                    <span>Original Price</span>
                    <span className="line-through">{ngn(selected!.originalPrice!)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-emerald-400">
                    <span>Discount Savings</span>
                    <span>-{ngn(selected!.originalPrice! - selected!.retailPrice)}</span>
                  </div>
                </>
              )}

              <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                <span className="text-base font-bold text-white">Total Amount</span>
                <span className="text-xl font-extrabold text-hi">
                  {selected ? ngn(selected.retailPrice) : "—"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuy}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-brand to-brand2 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all hover:brightness-110 active:scale-95"
            >
              Pay with Paystack &rarr;
            </button>

            {/* Trust assurances */}
            <div className="mt-4 space-y-2 border-t border-white/5 pt-4 text-[11px] text-mute">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>Secure guest checkout · No account needed</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>Instant automated delivery straight to your player account</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>Bank-level encryption via Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar on Mobile */}
      <StickyMobileBarV2 selectedProduct={selected} onBuy={handleBuy} />

      {/* Interactive Player ID Guide Modal */}
      <PlayerIdGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        initialGameId={game.id}
      />
    </>
  );
}
