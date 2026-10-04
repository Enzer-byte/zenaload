"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Game, Product } from "@/types";
import { ngn } from "@/config";
import { PlayerIdGuideModal } from "./PlayerIdGuideModal";

type PublicProduct = Omit<Product, "supplierCost" | "supplierProductId">;

export function TopupForm({
  game,
  products,
  initialId = "",
}: {
  game: Game;
  products: PublicProduct[];
  initialId?: string;
}) {
  const router = useRouter();
  const [pid, setPid] = useState("");
  const [fields, setFields] = useState<Record<string, string>>(
    initialId && game.playerFields[0] ? { [game.playerFields[0].key]: initialId } : {}
  );
  const [err, setErr] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  // 1. Smart Player ID memory on mount: prefill from localStorage if input is empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`zl_pid_${game.id}`);
      if (saved && game.playerFields.length > 0) {
        const firstKey = game.playerFields[0].key;
        setFields((prev) => {
          if (!prev[firstKey] || prev[firstKey].trim() === "") {
            return { ...prev, [firstKey]: saved.trim() };
          }
          return prev;
        });
      }
    } catch {
      // localStorage may be inaccessible in private modes
    }
  }, [game.id, game.playerFields]);

  // Handle typing & auto-save to localStorage when valid
  function handleFieldChange(f: { key: string; pattern?: string; label: string }, val: string) {
    setFields((prev) => ({ ...prev, [f.key]: val }));
    setErr("");

    const trimmed = val.trim();
    const patternRegex = new RegExp(f.pattern ?? ".+");
    if (trimmed && patternRegex.test(trimmed)) {
      try {
        localStorage.setItem(`zl_pid_${game.id}`, trimmed);
      } catch {
        // ignore storage errors
      }
    }
  }

  function buy() {
    if (!pid) return setErr("Select a top-up amount first.");
    for (const f of game.playerFields) {
      const val = fields[f.key] ?? "";
      if (!new RegExp(f.pattern ?? ".+").test(val.trim())) {
        const inputEl = document.getElementById(`field-${f.key}`);
        if (inputEl) {
          inputEl.focus();
        }
        return setErr(`Enter a valid ${f.label}.`);
      }
    }
    const q = new URLSearchParams({ product: pid });
    game.playerFields.forEach((f) => q.set(`f_${f.key}`, (fields[f.key] ?? "").trim()));
    router.push(`/checkout?${q}`);
  }

  const sel = products.find((p) => p.id === pid);
  const selHasDiscount = typeof sel?.originalPrice === "number" && sel.originalPrice > sel.retailPrice;
  const selDiscountPct =
    sel && selHasDiscount ? Math.round(((sel.originalPrice! - sel.retailPrice) / sel.originalPrice!) * 100) : 0;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const hasDiscount = typeof p.originalPrice === "number" && p.originalPrice > p.retailPrice;
            const discountPct = hasDiscount
              ? Math.round(((p.originalPrice! - p.retailPrice) / p.originalPrice!) * 100)
              : 0;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={pid === p.id}
                onClick={() => {
                  setPid(p.id);
                  setErr("");
                }}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                  pid === p.id
                    ? "border-brand bg-elevated shadow-md shadow-brand/10 ring-1 ring-brand"
                    : "border-line bg-card hover:border-line/80 hover:bg-card/80"
                }`}
              >
                {hasDiscount && (
                  <span className="absolute right-2.5 top-2.5 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    {discountPct}% OFF
                  </span>
                )}
                <b className="block pr-12 text-sm sm:text-base text-ink">{p.name}</b>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-bold text-hi">{ngn(p.retailPrice)}</span>
                  {hasDiscount && (
                    <span className="text-xs text-mute line-through">{ngn(p.originalPrice!)}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Player Details Card */}
        <div className="space-y-4 rounded-2xl border border-line bg-card p-5 h-fit">
          <h2 className="text-base font-semibold text-ink">Account Details</h2>

          {game.playerFields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={`field-${f.key}`} className="block text-sm font-medium text-ink2">
                  {f.label}
                </label>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-hi hover:text-hi/80 underline decoration-dotted underline-offset-2 transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Where to find Player ID?
                </button>
              </div>
              <input
                id={`field-${f.key}`}
                className="w-full rounded-xl border border-line bg-bg2 px-3 py-3 text-ink placeholder-mute focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                inputMode="numeric"
                placeholder={f.label}
                value={fields[f.key] ?? ""}
                onChange={(e) => handleFieldChange(f, e.target.value)}
              />
              <span className="block text-xs text-mute">
                Make sure it&apos;s correct. Your top-up is delivered to this account. {f.help}
              </span>
            </div>
          ))}

          {err && (
            <p role="alert" className="text-sm font-medium text-red-500">
              {err}
            </p>
          )}

          <button
            type="button"
            onClick={buy}
            className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand/90 transition shadow-lg shadow-brand/20 active:scale-[0.99]"
          >
            Top Up Now{sel ? ` — ${ngn(sel.retailPrice)}` : ""}
          </button>
        </div>
      </div>

      {/* Floating Sticky Bottom CTA bar on mobile viewports */}
      {sel && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-bg2/95 backdrop-blur-md px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="truncate text-sm font-semibold text-ink">{sel.name}</span>
                {selHasDiscount && (
                  <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {selDiscountPct}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-hi">{ngn(sel.retailPrice)}</span>
                {selHasDiscount && (
                  <span className="text-xs text-mute line-through">{ngn(sel.originalPrice!)}</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={buy}
              className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 active:scale-95 transition"
            >
              Top Up Now
            </button>
          </div>
        </div>
      )}

      {/* Player ID Guide Modal */}
      <PlayerIdGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        initialGameId={game.id}
      />
    </>
  );
}
