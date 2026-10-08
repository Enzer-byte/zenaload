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
    title: game ? `${game.name} Top-Up — ${config.brand}` : "Game Top-Up",
    description: game?.description ?? `Instant top-up for ${game?.name} in Naira.`,
  };
}

export default async function GameDetailPage({
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
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pt-4 pb-28 md:pb-16">
      {/* Breadcrumb Hierarchy verbatim from Stitch */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-3 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
        <Link href="/games" className="hover:text-primary transition-colors">
          Games
        </Link>
        <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
        <span className="text-on-surface font-bold">{game.name}</span>
      </nav>

      {/* Interactive Top-Up Form */}
      <TopupFormV2 game={game} products={products} initialId={pid} />
    </div>
  );
}
