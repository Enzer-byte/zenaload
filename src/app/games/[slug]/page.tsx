import { notFound } from "next/navigation";
import { productService } from "@/services/productService";
import { TopupForm } from "@/components/TopupForm";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const g = await productService.getGame((await params).slug); return { title: g ? `${g.name} Top-Up in Naira` : "Game", description: g?.description }; }
export default async function GamePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ pid?: string }> }) {
  const { pid } = await searchParams;
  const game = await productService.getGame((await params).slug); if (!game) notFound();
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {game.imageUrl && (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-line bg-bg2 shadow-md sm:h-24 sm:w-24">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.imageUrl} alt={game.name} className="h-full w-full object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-semibold text-ink">{game.name}</h1>
          <p className="mt-1 text-ink2">{game.description}</p>
        </div>
      </div>
      <TopupForm initialId={pid ? pid.trim() : ""} game={game} products={await productService.getProducts(game.id)} />
    </>
  );
}
