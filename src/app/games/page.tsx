export const dynamic = "force-dynamic"; // catalogue is editable in admin, so never serve a stale build-time copy
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { listGamesWithFrom } from "@/lib/gamesWithPrices";
export const metadata = { title: "Games", description: "Top up your favourite mobile games in Naira." };
const CATS = ["All", "Football", "Battle Royale", "FPS", "Mobile Games"];
export default async function Games({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  const { cat = "All", q = "" } = await searchParams, all = await listGamesWithFrom();
  const list = all.filter(({ game }) => (cat === "All" || game.category === cat) && game.name.toLowerCase().includes(q.toLowerCase()));
  return (<><h1 className="mb-4 text-3xl font-semibold">Games</h1><form className="mb-4"><input type="hidden" name="cat" value={cat} /><input name="q" defaultValue={q} aria-label="Search games" placeholder="Search games" className="w-full rounded-xl border border-line bg-bg2 px-3 py-3 md:max-w-sm" /></form>
  <div className="mb-5 flex flex-wrap gap-2">{CATS.map((c) => <Link key={c} href={`/games?cat=${encodeURIComponent(c)}&q=${encodeURIComponent(q)}`} aria-current={c === cat} className={`rounded-lg border px-3 py-1.5 text-sm ${c === cat ? "border-brand text-ink" : "border-line text-ink2"}`}>{c}</Link>)}</div>
  {list.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map(({ game, from }) => <GameCard key={game.id} game={game} from={from} />)}</div> : <div className="rounded-2xl border border-line bg-card p-6"><h2 className="font-medium">No games found</h2><p className="text-ink2">Try a different search or category.</p><Link href="/games" className="mt-3 inline-block text-hi">Clear filters</Link></div>}</>);
}
