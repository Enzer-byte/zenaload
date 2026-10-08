export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { listGamesWithFrom } from "@/lib/gamesWithPrices";
import { GameCardV2 } from "@/components/v2/GameCardV2";

export const metadata = {
  title: `All Games & Top-Ups — ${config.brand}`,
  description: "Instant automated direct in-game top-ups for Nigerian gamers. Enter in-game ID and pay in Naira.",
};

const CATEGORIES = ["All", "Battle Royale", "Sports & Football", "Shooter / FPS", "RPG / Strategy", "Gift Cards / Other"];

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat = "All", q = "" } = await searchParams;
  const allGames = await listGamesWithFrom();

  const filteredGames = allGames.filter(({ game }) => {
    const matchesCat =
      cat === "All" ||
      game.category.toLowerCase().includes(cat.toLowerCase().split(" ")[0]) ||
      (cat === "Sports & Football" && ["football", "sports"].some((c) => game.category.toLowerCase().includes(c))) ||
      (cat === "Shooter / FPS" && ["fps", "shooter"].some((c) => game.category.toLowerCase().includes(c)));

    const query = q.trim().toLowerCase();
    const matchesQuery =
      !query ||
      game.name.toLowerCase().includes(query) ||
      (game.description && game.description.toLowerCase().includes(query)) ||
      game.category.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="pb-16 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6">
      {/* HEADER SECTION: Centered title and subtitle verbatim from Stitch 8db6da78e3654233bd4a1fab4275d951 */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/15 border border-secondary-container/30 text-secondary font-bold text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
          <span>Automated Top-Up Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">
          All Games &amp; Top-Ups
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto">
          Instant, automated direct in-game top-ups for Nigerian gamers. Enter in-game ID and pay in Naira via Paystack.
        </p>

        {/* Search Bar */}
        <form method="GET" action="/games" className="pt-2 max-w-xl mx-auto relative flex items-center">
          <span className="material-symbols-outlined text-outline absolute left-4 pointer-events-none text-xl">
            search
          </span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search games (e.g. Free Fire, COD Mobile, eFootball)..."
            className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest rounded-xl border border-surface-variant text-on-surface placeholder:text-outline text-xs sm:text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 shadow-sm"
          />
          {q && (
            <Link
              href={`/games?cat=${encodeURIComponent(cat)}`}
              className="absolute right-4 text-xs text-outline hover:text-on-surface"
            >
              ✕
            </Link>
          )}
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto justify-start sm:justify-center pt-2 pb-1">
          {CATEGORIES.map((category) => {
            const isActive = cat.toLowerCase() === category.toLowerCase();
            return (
              <Link
                key={category}
                href={`/games?cat=${encodeURIComponent(category)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? "bg-on-background text-surface-container-lowest shadow-sm"
                    : "bg-surface-container-lowest border border-surface-variant text-on-surface-variant hover:border-primary-container hover:text-on-surface"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        {/* Trust Status Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-outline font-semibold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 24-Second Avg Delivery
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-on-surface">
            <span className="material-symbols-outlined text-xs">verified</span> Official Publisher APIs
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-on-surface">
            <span className="material-symbols-outlined text-xs">lock</span> Paystack Bank Settlement
          </span>
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">Available Games ({filteredGames.length})</h2>
          <span className="text-xs text-outline font-medium">Select your game to configure denomination and Player ID</span>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredGames.map(({ game, from }) => (
              <GameCardV2 key={game.id} game={game} from={from} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant text-center space-y-3">
            <p className="text-on-surface-variant text-sm">No games matched your search query &quot;{q}&quot;.</p>
            <Link
              href="/games"
              className="inline-block px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>

      {/* 3 STEPS INSTRUCTION STRIP verbatim from Stitch 8db6da78e3654233bd4a1fab4275d951 */}
      <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 mt-16 border border-surface-variant">
        <div className="text-center max-w-md mx-auto mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Direct Publisher Fulfillment</span>
          <h3 className="text-xl font-extrabold text-on-surface mt-1">Top up in 3 simple steps</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">No mandatory accounts or password passwords. Enter your in-game UID and pay from Nigerian banks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-variant flex flex-col gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">1</span>
            <h4 className="font-bold text-on-surface text-sm">Pick Game &amp; Player ID</h4>
            <p className="text-xs text-on-surface-variant">Choose your denomination and enter your in-game UID or Game ID from your profile.</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-variant flex flex-col gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">2</span>
            <h4 className="font-bold text-on-surface text-sm">Pay Securely via Paystack</h4>
            <p className="text-xs text-on-surface-variant">Transfer from bank accounts, OPay, PalmPay, USSD, or Debit Card in Nigerian Naira.</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-variant flex flex-col gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">3</span>
            <h4 className="font-bold text-on-surface text-sm">Direct In-Game Credit</h4>
            <p className="text-xs text-on-surface-variant">Automated API credits your diamonds, CP, or coins right into your gaming account in ~24s.</p>
          </div>
        </div>
      </section>

      {/* CAN'T FIND YOUR GAME CALLOUT verbatim from Stitch 8db6da78e3654233bd4a1fab4275d951 */}
      <section className="bg-on-background rounded-2xl p-6 sm:p-8 mt-12 text-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-secondary-container">Need a different game?</span>
          <h3 className="text-xl font-extrabold text-surface-container-lowest mt-0.5">Can&apos;t find your game?</h3>
          <p className="text-xs text-outline-variant mt-1">Looking for a game not listed here? Contact us on WhatsApp and we will add publisher distribution.</p>
        </div>
        <a
          href={`https://wa.me/${config.whatsapp}?text=Hello+Zenaload+Support,+I+would+like+to+request+a+game+top-up:`}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-extrabold text-xs flex items-center gap-1.5 whitespace-nowrap active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          <span>Request Game on WhatsApp</span>
        </a>
      </section>
    </div>
  );
}
