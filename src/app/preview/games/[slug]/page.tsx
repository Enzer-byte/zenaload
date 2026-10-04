export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { config } from "@/config";
import { productService } from "@/services/productService";
import { TopupFormV2 } from "@/components/v2/TopupFormV2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await productService.getGame(slug);
  return {
    title: game ? `${game.name} Top-Up in Naira — ${config.brand} (V2 Preview)` : "Game Top-Up",
    description: game?.description ?? `Instant top-up for ${game?.name} in Naira.`,
  };
}

export default async function PreviewGameDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pid?: string }>;
}) {
  const { slug } = await params;
  const { pid } = await searchParams;

  const game = await productService.getGame(slug);
  if (!game) {
    notFound();
  }

  const products = await productService.getProducts(game.id);

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-mute">
        <Link href="/preview" className="hover:text-white transition-colors">
          Preview
        </Link>
        <span>/</span>
        <Link href="/preview/games" className="hover:text-white transition-colors">
          Games
        </Link>
        <span>/</span>
        <span className="text-white font-medium">{game.name}</span>
      </nav>

      {/* Game Profile Hero Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-8 backdrop-blur-xl">
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-brand/20 blur-[80px]"
          aria-hidden="true"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {game.imageUrl ? (
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-bg2 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.imageUrl}
                alt={game.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand/20 to-brand2/20 text-3xl shadow-xl">
              🎮
            </div>
          )}

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-bg2 px-2.5 py-0.5 text-[11px] font-semibold text-ink2">
                {game.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Instant Delivery (~24s)
              </span>
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-300">
                Official Reseller API
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {game.name}
            </h1>

            <p className="text-xs sm:text-sm text-ink2 max-w-2xl">
              {game.description || `Instant ${game.name} top-ups delivered in seconds via official Player ID.`}
            </p>
          </div>
        </div>
      </section>

      {/* V2 Two-Column Top-Up Flow (Denominations + Player Details + Summary Checkout) */}
      <TopupFormV2
        game={game}
        products={products}
        initialId={pid ? pid.trim() : ""}
      />
    </div>
  );
}
