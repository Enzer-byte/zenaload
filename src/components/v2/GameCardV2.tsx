import Link from "next/link";
import type { Game } from "@/types";
import { ngn } from "@/config";

interface GameCardV2Props {
  game: Game;
  from?: number;
  preview?: boolean;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "battle royale":
      return "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30";
    case "fps / shooter":
    case "shooter":
      return "from-red-500/20 to-rose-500/10 text-rose-300 border-rose-500/30";
    case "sports":
      return "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30";
    case "moba":
      return "from-purple-500/20 to-indigo-500/10 text-purple-300 border-purple-500/30";
    default:
      return "from-brand/20 to-brand2/10 text-hi border-brand/30";
  }
};

const hashHue = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 15);

export function GameCardV2({ game, from, preview }: GameCardV2Props) {
  const badgeStyle = getCategoryColor(game.category);
  const hue = hashHue(game.slug);
  const targetHref = preview ? `/preview/games/${game.slug}` : `/games/${game.slug}`;

  return (
    <Link
      href={targetHref}
      aria-label={`Top up ${game.name}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl hover:shadow-brand/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {/* Top Media Artwork / Gradient Bento Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg2">
        {game.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.imageUrl}
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="relative flex h-full w-full items-end p-4"
            style={{
              background: `radial-gradient(circle at 75% 25%, hsl(${hue} 75% 55% / .35), transparent 70%), linear-gradient(150deg, #151B2A 0%, #0D111C 100%)`,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-xl font-bold text-white/80">{game.name.charAt(0)}</span>
            </div>
          </div>
        )}

        {/* Ambient bottom gradient shade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />

        {/* Publisher / Category pill & Active Server status indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${badgeStyle}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {game.category}
          </span>
        </div>
      </div>

      {/* Card Content & Action Area */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-hi transition-colors">
            {game.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-mute">
            {game.description || `Instant credits & top-ups for ${game.name}`}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-line/60 pt-3">
          <div>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-mute">
              Starting at
            </span>
            <span className="text-sm font-bold text-ink">
              {from ? ngn(from) : "Coming soon"}
            </span>
          </div>

          <span className="inline-flex items-center justify-center rounded-lg border border-line bg-elevated px-3 py-1.5 text-xs font-semibold text-ink2 transition-all duration-200 group-hover:border-brand group-hover:bg-brand group-hover:text-white group-hover:shadow-md group-hover:shadow-brand/25">
            Top Up
          </span>
        </div>
      </div>
    </Link>
  );
}
