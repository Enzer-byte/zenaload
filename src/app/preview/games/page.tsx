export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { listGamesWithFrom } from "@/lib/gamesWithPrices";
import { GameCardV2 } from "@/components/v2/GameCardV2";

export const metadata = {
  title: `All Games — ${config.brand} (V2 Preview)`,
  description: "Browse all supported mobile games for instant Naira top-ups.",
};

const CATEGORIES = ["All", "Football", "Battle Royale", "FPS", "Mobile Games"];

export default async function PreviewGamesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat = "All", q = "" } = await searchParams;
  const allGames = await listGamesWithFrom();

  const filteredGames = allGames.filter(({ game }) => {
    const matchesCat =
      cat === "All" ||
      game.category.toLowerCase() === cat.toLowerCase() ||
      (cat === "Mobile Games" && ["football", "battle royale", "fps", "mobile"].includes(game.category.toLowerCase()));

    const query = q.trim().toLowerCase();
    const matchesQuery =
      !query ||
      game.name.toLowerCase().includes(query) ||
      (game.description && game.description.toLowerCase().includes(query)) ||
      game.category.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Catalog Header & Search */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-8">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs text-mute">
            <Link href="/preview" className="hover:text-white transition-colors">
              Preview
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Games</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Browse All Games
          </h1>
          <p className="mt-1 text-sm text-ink2">
            Instant credit delivery directly into your player account in Naira.
          </p>
        </div>

        {/* Search input form */}
        <form method="GET" action="/preview/games" className="w-full md:w-80">
          {cat !== "All" && <input type="hidden" name="cat" value={cat} />}
          <div className="relative flex items-center rounded-2xl border border-white/10 bg-card/80 p-1.5 backdrop-blur-md transition-all focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand">
            <span className="pl-3 text-mute">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by game name..."
              className="w-full bg-transparent px-3 py-1.5 text-xs text-white placeholder-mute focus:outline-none"
            />
            {q && (
              <Link
                href={`/preview/games?cat=${encodeURIComponent(cat)}`}
                className="mr-2 text-xs text-mute hover:text-white"
                title="Clear search"
              >
                ✕
              </Link>
            )}
            <button
              type="submit"
              className="rounded-xl bg-elevated px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand/40 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Pills & Active Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => {
            const isActive = cat.toLowerCase() === category.toLowerCase();
            return (
              <Link
                key={category}
                href={`/preview/games?cat=${encodeURIComponent(category)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-brand to-brand2 text-white shadow-md shadow-brand/25 border border-brand/50 ring-1 ring-brand"
                    : "border border-white/10 bg-card/60 text-ink2 hover:border-white/20 hover:bg-card hover:text-white"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-mute">
          <span>Showing</span>
          <span className="font-semibold text-white">{filteredGames.length}</span>
          <span>{filteredGames.length === 1 ? "game" : "games"}</span>
          {(cat !== "All" || q) && (
            <>
              <span>·</span>
              <Link href="/preview/games" className="text-hi hover:underline">
                Reset filters
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Bento Grid Games Listing */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(({ game, from }) => (
            <GameCardV2 key={game.id} game={game} from={from} preview={true} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-card/50 p-12 text-center backdrop-blur-sm max-w-xl mx-auto space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-2xl">
            🎮
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Games Found</h3>
            <p className="mt-1 text-xs text-ink2">
              We couldn&apos;t find any games matching {q ? `"${q}"` : "this category"}.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/preview/games"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:brightness-110"
            >
              Reset All Filters
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
