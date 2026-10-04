"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Game, Product } from "@/types";
import { ngn } from "@/config";
type PublicProduct = Omit<Product, "supplierCost" | "supplierProductId">;
export function TopupForm({ game, products, initialId = "" }: { game: Game; products: PublicProduct[]; initialId?: string }) {
  const router = useRouter();
  const [pid, setPid] = useState(""), [fields, setFields] = useState<Record<string, string>>(initialId ? { [game.playerFields[0].key]: initialId } : {}), [err, setErr] = useState("");
  function buy() {
    if (!pid) return setErr("Select a top-up amount first.");
    for (const f of game.playerFields) if (!new RegExp(f.pattern ?? ".+").test(fields[f.key] ?? "")) return setErr(`Enter a valid ${f.label}.`);
    const q = new URLSearchParams({ product: pid }); game.playerFields.forEach((f) => q.set(`f_${f.key}`, fields[f.key]));
    router.push(`/checkout?${q}`);
  }
  const sel = products.find((p) => p.id === pid);
  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        {products.map((p) => {
          const hasDiscount = typeof p.originalPrice === "number" && p.originalPrice > p.retailPrice;
          const discountPct = hasDiscount ? Math.round(((p.originalPrice! - p.retailPrice) / p.originalPrice!) * 100) : 0;
          return (
            <button
              key={p.id}
              aria-pressed={pid === p.id}
              onClick={() => setPid(p.id)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                pid === p.id ? "border-brand bg-elevated shadow-md shadow-brand/10" : "border-line bg-card hover:border-line/80"
              }`}
            >
              {hasDiscount && (
                <span className="absolute right-2.5 top-2.5 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                  {discountPct}% OFF
                </span>
              )}
              <b className="block pr-12 text-sm sm:text-base">{p.name}</b>
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
      <div className="space-y-3 rounded-2xl border border-line bg-card p-5">
  {err && <p role="alert" className="text-sm text-red-500">{err}</p>}<button onClick={buy} className="w-full rounded-xl bg-brand py-3 font-medium">Buy Now{sel ? ` — ${ngn(sel.retailPrice)}` : ""}</button></div></div>);
}
