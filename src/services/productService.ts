import { catalogStore } from "@/repositories/catalogStore";
// Customer-facing reads: only active games/products, and never supplier cost.
export const productService = {
  listGames: async () => (await catalogStore.games()).filter((g) => g.active).sort((a, b) => a.sortOrder - b.sortOrder),
  getGame: async (slug: string) => (await catalogStore.games()).find((g) => g.slug === slug && g.active) ?? null,
  getProducts: async (gameId: string) => (await catalogStore.products()).filter((p) => p.gameId === gameId && p.active).sort((a, b) => a.retailPrice - b.retailPrice).map(({ supplierCost, supplierProductId, ...pub }) => pub),
  async getProduct(id: string) { const p = (await catalogStore.products()).find((x) => x.id === id); if (!p?.active) return null; return (await catalogStore.games()).find((g) => g.id === p.gameId)?.active ? p : null; },
};
