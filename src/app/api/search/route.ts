import { NextResponse } from "next/server";
import { productService } from "@/services/productService";
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 40), games = await productService.listGames();
  if (!q) return NextResponse.json({ popular: games.slice(0, 4).map((g) => ({ name: g.name, slug: g.slug })), games: [], products: [] });
  const products: { name: string; game: string; slug: string; price: number }[] = [];
  for (const g of games) for (const p of await productService.getProducts(g.id)) if (`${p.name} ${g.name}`.toLowerCase().includes(q)) products.push({ name: p.name, game: g.name, slug: g.slug, price: p.retailPrice });
  return NextResponse.json({ popular: [], games: games.filter((g) => g.name.toLowerCase().includes(q)).map((g) => ({ name: g.name, slug: g.slug, category: g.category })), products: products.slice(0, 6) });
}
