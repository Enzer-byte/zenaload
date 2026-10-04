"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ngn } from "@/config";
import { useLocal } from "@/lib/useLocal";
import type { PublicOrder } from "@/lib/publicOrder";

const EmptyState = ({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
}) => (
  <div className="rounded-3xl border border-white/10 bg-card/60 p-8 sm:p-12 text-center backdrop-blur-xl max-w-lg mx-auto space-y-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg2 text-2xl mx-auto border border-white/10">
      🎮
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-mute">{desc}</p>
    <div className="pt-2">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand2 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand/25 hover:brightness-110 transition active:scale-95"
      >
        <span>{cta}</span>
        <span>&rarr;</span>
      </Link>
    </div>
  </div>
);

export function AccountOrders() {
  const [ids, , ready] = useLocal<string[]>("zl_orders", []);
  const [list, setList] = useState<PublicOrder[] | null>(null);

  useEffect(() => {
    if (ready) {
      Promise.all(
        ids.map((id) =>
          fetch(`/api/orders/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      ).then((l) => setList(l.filter(Boolean)));
    }
  }, [ready, ids]);

  if (!list) {
    return (
      <div className="h-32 rounded-3xl bg-card/50 border border-white/5 animate-pulse" />
    );
  }

  if (!list.length) {
    return (
      <EmptyState
        title="No Orders Yet"
        desc="Orders you place or track on this device will automatically appear here."
        href="/games"
        cta="Browse Games"
      />
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-card/75 p-6 backdrop-blur-xl shadow-xl overflow-hidden">
      <h2 className="text-lg font-bold text-white mb-4">Recent Top-Up Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left text-mute uppercase tracking-wider font-semibold">
              <th className="pb-3 px-3">Order ID</th>
              <th className="pb-3 px-3">Game</th>
              <th className="pb-3 px-3">Package</th>
              <th className="pb-3 px-3">Amount</th>
              <th className="pb-3 px-3">Status</th>
              <th className="pb-3 px-3">Date</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {list.map((o) => {
              const done = o.fulfillment === "SUCCESSFUL";
              return (
                <tr key={o.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {o.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-ink2">
                    {o.gameName}
                  </td>
                  <td className="py-3 px-3 font-semibold text-hi">
                    {o.productName}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">
                    {ngn(o.amount)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        done
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-brand/10 text-hi border border-brand/20"
                      }`}
                    >
                      {o.fulfillment === "NOT_STARTED" ? o.payment : o.fulfillment}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-mute font-mono">
                    {o.createdAt.slice(0, 10)}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <Link
                      href={`/orders/${o.id}`}
                      className="font-medium text-hi hover:text-white transition"
                    >
                      View Receipt
                    </Link>
                    {o.gameSlug && (
                      <Link
                        href={`/games/${o.gameSlug}`}
                        className="font-medium text-emerald-400 hover:text-white transition"
                      >
                        Buy Again
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type GameItem = { slug: string; name: string; fieldLabel: string };
type SavedId = {
  slug: string;
  game: string;
  label: string;
  pid: string;
  nick: string;
};

export function PlayerIds({ games }: { games: GameItem[] }) {
  const [saved, setSaved, ready] = useLocal<SavedId[]>("zl_player_ids", []);
  const [slug, setSlug] = useState(games[0]?.slug ?? "");
  const [pid, setPid] = useState("");
  const [nick, setNick] = useState("");
  const [err, setErr] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const g = games.find((x) => x.slug === slug);
    if (!g) return;
    if (!/^\d{6,12}$/.test(pid)) {
      return setErr(`Enter a valid ${g.fieldLabel} (6–12 numeric digits).`);
    }
    setSaved([
      ...saved,
      {
        slug,
        game: g.name,
        label: g.fieldLabel,
        pid: pid.trim(),
        nick: nick.trim() || "Player",
      },
    ]);
    setPid("");
    setNick("");
    setErr("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-8 items-start">
      {/* Saved IDs List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Your Saved Player IDs</h2>

        {ready && !saved.length ? (
          <div className="rounded-3xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-xl">
            <p className="text-sm text-mute">
              No saved Player IDs yet. Save your UIDs below to enable 1-tap instant checkouts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saved.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-card/75 p-5 backdrop-blur-xl space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[10px] font-bold text-hi">
                    {s.game}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSaved(saved.filter((_, j) => j !== i))}
                    className="text-xs text-mute hover:text-red-400 transition"
                    title="Remove ID"
                  >
                    ✕ Remove
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{s.nick}</h4>
                  <p className="font-mono text-xs text-ink2 mt-0.5">
                    {s.label}: <strong className="text-white">{s.pid}</strong>
                  </p>
                </div>

                <Link
                  href={`/games/${s.slug}?pid=${s.pid}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-gradient-to-r from-brand to-brand2 py-2 text-xs font-bold text-white shadow-md shadow-brand/20 hover:brightness-110 transition active:scale-95"
                >
                  <span>⚡ 1-Tap Top Up</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New ID Form */}
      <form
        onSubmit={add}
        className="rounded-3xl border border-white/10 bg-card/75 p-6 backdrop-blur-xl shadow-xl space-y-4"
      >
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-base font-bold text-white">Add a New Player ID</h3>
          <p className="text-xs text-mute mt-0.5">
            Save your in-game UID to this browser.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink2 mb-1">
            Game
          </label>
          <select
            aria-label="Game"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-bg2/90 px-3.5 py-2.5 text-xs text-white transition focus:border-brand focus:outline-none"
          >
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink2 mb-1">
            Player ID / UID
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            placeholder="e.g. 1928374650"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-bg2/90 px-3.5 py-2.5 font-mono text-xs text-white placeholder-mute transition focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink2 mb-1">
            Nickname / Label
          </label>
          <input
            type="text"
            placeholder="e.g. Main Account"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-bg2/90 px-3.5 py-2.5 text-xs text-white placeholder-mute transition focus:border-brand focus:outline-none"
          />
        </div>

        {err && (
          <p role="alert" className="text-xs text-red-400">
            {err}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-brand to-brand2 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/20 hover:brightness-110 transition active:scale-95"
        >
          Save to Device
        </button>
      </form>
    </div>
  );
}
