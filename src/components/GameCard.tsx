import Link from "next/link";
import type { Game } from "@/types";
import { ngn } from "@/config";
const hue = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
// Artwork is a placeholder (no official logos). Replace with licensed assets later.
export function GameCard({ game, from }: { game: Game; from?: number }) {
  return (<Link href={`/games/${game.slug}`} aria-label={`Top up ${game.name}`} className="group block overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-0.5 hover:border-hi">
    <div className="flex aspect-[4/3] items-end p-3 text-xs text-white/60" style={{ background: `radial-gradient(circle at 70% 20%, hsl(${hue(game.slug)} 70% 45% / .5), transparent 60%), linear-gradient(160deg,#151B2A,#0D111C)` }}>Artwork placeholder</div>
    <div className="p-4"><h3 className="font-medium">{game.name}</h3><p className="text-sm text-mute">{game.category}</p><p className="mt-1 font-semibold text-hi">{from ? `From ${ngn(from)}` : "Coming soon"}</p><span className="mt-3 inline-block rounded-lg bg-elevated px-3 py-1.5 text-sm transition group-hover:bg-brand">Top Up</span></div></Link>);
}
