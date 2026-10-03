import { notFound } from "next/navigation";
import { productService } from "@/services/productService";
import { TopupForm } from "@/components/TopupForm";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const g = await productService.getGame((await params).slug); return { title: g ? `${g.name} Top-Up in Naira` : "Game", description: g?.description }; }
export default async function GamePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ pid?: string }> }) {
  const { pid } = await searchParams;
  const game = await productService.getGame((await params).slug); if (!game) notFound();
  return (<><h1 className="text-3xl font-semibold">{game.name}</h1><p className="mb-6 text-ink2">{game.description}</p><TopupForm initialId={/^\d{6,12}$/.test(pid ?? "") ? pid : ""} game={game} products={await productService.getProducts(game.id)} /></>);
}
