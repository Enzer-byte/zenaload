import { productService } from "@/services/productService";
export async function listGamesWithFrom() {
  const games = await productService.listGames();
  return Promise.all(games.map(async (game) => { const p = await productService.getProducts(game.id); return { game, from: p.length ? Math.min(...p.map((x) => x.retailPrice)) : undefined }; }));
}
