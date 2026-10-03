"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ngn } from "@/config";
import { useLocal } from "@/lib/useLocal";
import type { PublicOrder } from "@/lib/publicOrder";
const empty = (t: string, d: string, href: string, cta: string) => <div className="rounded-2xl border border-line bg-card p-6"><h2 className="font-medium">{t}</h2><p className="my-2 text-ink2">{d}</p><Link href={href} className="inline-block rounded-xl bg-brand px-5 py-2.5">{cta}</Link></div>;
export function AccountOrders() {
  const [ids, , ready] = useLocal<string[]>("zl_orders", []), [list, setList] = useState<PublicOrder[] | null>(null);
  useEffect(() => { if (ready) Promise.all(ids.map((id) => fetch(`/api/orders/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null))).then((l) => setList(l.filter(Boolean))); }, [ready, ids]);
  if (!list) return <div className="h-24 animate-pulse rounded-2xl bg-card" aria-label="Loading orders" />;
  if (!list.length) return empty("No orders yet", "Orders you place or track on this device appear here.", "/games", "Browse Games");
  return (<div className="overflow-x-auto"><table className="w-full min-w-[600px] text-sm"><thead className="text-left text-mute"><tr>{["Order", "Game", "Product", "Amount", "Status", "Date", ""].map((h) => <th key={h} className="p-2 font-normal">{h}</th>)}</tr></thead><tbody>{list.map((o) => <tr key={o.id} className="border-t border-line"><td className="p-2">{o.id}</td><td className="p-2">{o.gameName}</td><td className="p-2">{o.productName}</td><td className="p-2">{ngn(o.amount)}</td><td className="p-2">{o.fulfillment === "NOT_STARTED" ? o.payment : o.fulfillment}</td><td className="p-2">{o.createdAt.slice(0, 10)}</td><td className="whitespace-nowrap p-2"><Link className="text-hi" href={`/orders/${o.id}`}>View</Link> · <Link className="text-hi" href={`/games/${o.gameSlug}`}>Buy Again</Link></td></tr>)}</tbody></table></div>);
}
type G = { slug: string; name: string; fieldLabel: string };
type Saved = { slug: string; game: string; label: string; pid: string; nick: string };
export function PlayerIds({ games }: { games: G[] }) {
  const [saved, setSaved, ready] = useLocal<Saved[]>("zl_player_ids", []), [slug, setSlug] = useState(games[0]?.slug ?? ""), [pid, setPid] = useState(""), [nick, setNick] = useState(""), [err, setErr] = useState("");
  const add = () => { const g = games.find((x) => x.slug === slug)!; if (!/^\d{6,12}$/.test(pid)) return setErr(`Enter a valid ${g.fieldLabel} (6–12 digits).`); setSaved([...saved, { slug, game: g.name, label: g.fieldLabel, pid, nick: nick || "Player" }]); setPid(""); setNick(""); setErr(""); };
  const inp = "w-full rounded-xl border border-line bg-bg2 px-3 py-3";
  return (<div className="space-y-6">{ready && !saved.length ? <div className="rounded-2xl border border-line bg-card p-6"><h2 className="font-medium">No saved Player IDs</h2><p className="text-ink2">Save an ID for one-tap repeat top-ups.</p></div> : saved.map((s, i) => <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4"><div><b>{s.game}</b> · {s.nick}<div className="text-sm text-mute">{s.label}: {s.pid}</div></div><div className="flex gap-2"><Link href={`/games/${s.slug}?pid=${s.pid}`} className="rounded-lg bg-brand px-3 py-1.5 text-sm">Top Up</Link><button className="rounded-lg border border-line px-3 py-1.5 text-sm" onClick={() => setSaved(saved.filter((_, j) => j !== i))}>Remove</button></div></div>)}
  <div className="max-w-md space-y-3 rounded-2xl border border-line bg-card p-5"><h2 className="font-medium">Add a Player ID</h2><select aria-label="Game" className={inp} value={slug} onChange={(e) => setSlug(e.target.value)}>{games.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}</select><input aria-label="Player ID" inputMode="numeric" placeholder="Player ID" className={inp} value={pid} onChange={(e) => setPid(e.target.value)} /><input aria-label="Nickname" placeholder="Nickname" className={inp} value={nick} onChange={(e) => setNick(e.target.value)} />{err && <p role="alert" className="text-sm text-red-500">{err}</p>}<button onClick={add} className="w-full rounded-xl bg-brand py-3">Save</button></div></div>);
}
