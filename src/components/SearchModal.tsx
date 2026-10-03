"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ngn } from "@/config";
import { useLocal } from "@/lib/useLocal";
type R = { popular: { name: string; slug: string }[]; games: { name: string; slug: string; category: string }[]; products: { name: string; game: string; slug: string; price: number }[] };
export function SearchModal() {
  const ref = useRef<HTMLDialogElement>(null), [q, setQ] = useState(""), [r, setR] = useState<R | null>(null), [loading, setLoading] = useState(false), [recent, setRecent] = useLocal<string[]>("zl_recent", []);
  useEffect(() => { setLoading(true); const t = setTimeout(async () => { try { setR(await (await fetch(`/api/search?q=${encodeURIComponent(q)}`)).json()); } catch { setR(null); } setLoading(false); }, 200); return () => clearTimeout(t); }, [q]);
  const done = () => { const v = q.trim(); if (v) setRecent([v, ...recent.filter((x) => x !== v)].slice(0, 5)); ref.current?.close(); };
  const link = "block rounded-xl border border-line bg-card p-3 hover:border-hi";
  return (<><button aria-label="Search" onClick={() => { setQ(""); ref.current?.showModal(); }} className="rounded-lg px-2 py-1 text-ink2">🔍</button>
  <dialog ref={ref} aria-label="Search" className="mt-[8vh] w-[min(560px,92vw)] rounded-2xl border border-line bg-bg2 p-4 text-ink backdrop:bg-black/60"><input autoFocus type="search" aria-label="Search games and top-ups" placeholder="Search games and top-ups" value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl border border-line bg-bg px-3 py-3" />
  <div className="mt-3 space-y-2" aria-live="polite">{loading && !r ? <div className="h-16 animate-pulse rounded-xl bg-card" /> : !q.trim() ? (<>{recent.length > 0 && <><p className="text-xs text-mute">Recent searches</p><div className="flex flex-wrap gap-2">{recent.map((x) => <button key={x} onClick={() => setQ(x)} className="rounded-lg border border-line px-3 py-1 text-sm">{x}</button>)}</div></>}<p className="text-xs text-mute">Popular games</p>{r?.popular.map((g) => <Link key={g.slug} href={`/games/${g.slug}`} onClick={done} className={link}>{g.name}</Link>)}</>) : r && r.games.length + r.products.length === 0 ? <div className="rounded-xl border border-line bg-card p-4"><b>No results</b><p className="text-sm text-ink2">Try a game name like eFootball.</p></div> : (<>{r?.games.map((g) => <Link key={g.slug} href={`/games/${g.slug}`} onClick={done} className={link}>{g.name} <span className="text-xs text-mute">{g.category}</span></Link>)}{r?.products.map((p) => <Link key={p.slug + p.name} href={`/games/${p.slug}`} onClick={done} className={link}>{p.game}: {p.name} <span className="text-hi">{ngn(p.price)}</span></Link>)}</>)}</div>
  <button onClick={() => ref.current?.close()} className="mt-3 w-full rounded-xl border border-line py-2 text-ink2">Close</button></dialog></>);
}
