import Link from "next/link";
import type { Game } from "@/types";
import { ngn } from "@/config";

interface GameCardV2Props {
  game: Game;
  from?: number;
  preview?: boolean;
}

export function GameCardV2({ game, from, preview }: GameCardV2Props) {
  const targetHref = preview ? `/preview/games/${game.slug}` : `/games/${game.slug}`;

  // Mapping game to representative badges matching Stitch screenshots
  const isFreeFire = game.slug.includes("free-fire");
  const isCodm = game.slug.includes("call-of-duty") || game.slug.includes("cod");
  const isEfootball = game.slug.includes("efootball");

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Cover Artwork Container */}
        <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden bg-slate-900">
          {game.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.imageUrl}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-on-background via-inverse-surface to-on-background text-surface-container-lowest">
              <span className="text-3xl font-extrabold tracking-tight">{game.name.slice(0, 2).toUpperCase()}</span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {isFreeFire && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow">
                🔥 Most Popular
              </span>
            )}
            {isCodm && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow">
                🎯 Trending
              </span>
            )}
            {isEfootball && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow">
                ⚽ Live Event
              </span>
            )}
            {!isFreeFire && !isCodm && !isEfootball && (
              <span className="px-2 py-0.5 rounded-md bg-inverse-surface/80 text-surface-container-lowest font-bold text-[10px] backdrop-blur-sm">
                {game.category}
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 rounded-full bg-black/60 text-emerald-400 text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ~24s Auto
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <h3 className="font-title-md text-title-md font-extrabold text-on-surface group-hover:text-primary transition-colors">
            {game.name}
          </h3>
          <p className="mt-1 text-xs text-on-surface-variant line-clamp-1">
            {game.description || `Instant automated top-up in Naira`}
          </p>
        </div>
      </div>

      {/* Card Action & Price Row verbatim from Stitch */}
      <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-surface-variant/20 mt-2">
        <div>
          <span className="block text-[11px] font-semibold text-outline uppercase tracking-wider">
            Price
          </span>
          <span className="font-title-md text-title-md font-extrabold text-on-surface">
            {from ? `From ${ngn(from)}` : "Available"}
          </span>
        </div>

        <Link
          href={targetHref}
          className="px-4 py-2 rounded-xl bg-primary text-white font-label-md text-xs font-bold hover:bg-primary-container active:scale-95 transition-all shadow-sm flex items-center gap-1"
        >
          <span>Top-up now</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
