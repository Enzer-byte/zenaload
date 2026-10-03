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
    for (const f of game.playerFields) if (!new RegExp(f.pattern ?? ".+").test(fields[f.key] ?? "")) return setErr(`Enter a valid ${f.label} (6–12 digits).`);
    const q = new URLSearchParams({ product: pid }); game.playerFields.forEach((f) => q.set(`f_${f.key}`, fields[f.key]));
    router.push(`/checkout?${q}`);
  }
  const sel = products.find((p) => p.id === pid);
  return (<div className="grid gap-6 md:grid-cols-[1.4fr_1fr]"><div className="grid grid-cols-2 gap-3">{products.map((p) => (<button key={p.id} aria-pressed={pid === p.id} onClick={() => setPid(p.id)} className={`rounded-xl border p-4 text-left ${pid === p.id ? "border-brand bg-elevated" : "border-line bg-card"}`}><b>{p.name}</b><div className="text-hi">{ngn(p.retailPrice)}</div></button>))}</div>
  <div className="space-y-3 rounded-2xl border border-line bg-card p-5">{game.playerFields.map((f) => (<label key={f.key} className="block text-sm text-ink2">{f.label}<input className="mt-1 w-full rounded-xl border border-line bg-bg2 px-3 py-3" inputMode="numeric" value={fields[f.key] ?? ""} onChange={(e) => { setFields({ ...fields, [f.key]: e.target.value }); setErr(""); }} /><span className="text-xs text-mute">Make sure it's correct. Your top-up is delivered to this account. {f.help}</span></label>))}
  {err && <p role="alert" className="text-sm text-red-500">{err}</p>}<button onClick={buy} className="w-full rounded-xl bg-brand py-3 font-medium">Buy Now{sel ? ` — ${ngn(sel.retailPrice)}` : ""}</button></div></div>);
}
