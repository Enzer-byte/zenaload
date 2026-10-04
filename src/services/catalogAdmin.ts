import { z } from "zod";
import { catalogStore } from "@/repositories/catalogStore";
const int = z.number().int();
export const CatalogActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("product.update"), id: z.string(), retailPrice: int.positive().optional(), supplierCost: int.min(0).optional(), originalPrice: int.min(0).nullable().optional(), active: z.boolean().optional(), featured: z.boolean().optional(), popular: z.boolean().optional() }),
  z.object({ type: z.literal("product.add"), gameId: z.string(), name: z.string().min(1).max(60), denomination: int.positive(), retailPrice: int.positive(), supplierCost: int.min(0), originalPrice: int.min(0).optional(), supplierProductId: z.string().min(1).max(80) }),
  z.object({ type: z.literal("game.update"), id: z.string(), name: z.string().min(1).max(60).optional(), description: z.string().max(1000).optional(), imageUrl: z.string().max(500).optional(), active: z.boolean().optional(), featured: z.boolean().optional(), sortOrder: int.optional() }),
  z.object({ type: z.literal("game.add"), name: z.string().min(1).max(60), slug: z.string().max(60).optional(), category: z.enum(["Football", "Battle Royale", "FPS", "Mobile Games"]), fieldLabel: z.string().min(1).max(30).default("Player ID"), description: z.string().max(1000).optional(), imageUrl: z.string().max(500).optional() }),
]);
export type CatalogAction = z.infer<typeof CatalogActionSchema>;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const no = (message: string) => ({ ok: false, message });
// Price changes only affect NEW orders: each order stores the amount the customer was charged.
export async function catalogAdmin(a: CatalogAction): Promise<{ ok: boolean; message: string }> {
  const [games, products] = await Promise.all([catalogStore.games(), catalogStore.products()]);
  switch (a.type) {
    case "product.update": {
      const p = products.find((x) => x.id === a.id); if (!p) return no("Product not found.");
      const updates = Object.fromEntries(Object.entries(a).filter(([k, v]) => k !== "type" && k !== "id" && v !== undefined));
      if (a.originalPrice === null || a.originalPrice === 0) {
        delete p.originalPrice;
        delete updates.originalPrice;
      }
      const n = { ...p, ...updates };
      if (n.supplierCost > n.retailPrice) return no("Supplier cost can't be higher than the retail price.");
      if (n.originalPrice && n.originalPrice < n.retailPrice) return no("Original price (for discount badge) cannot be lower than retail price.");
      await catalogStore.saveProduct(n); return { ok: true, message: "Product updated." };
    }
    case "product.add": {
      if (!games.some((g) => g.id === a.gameId)) return no("Game not found.");
      if (a.supplierCost > a.retailPrice) return no("Supplier cost can't be higher than the retail price.");
      if (a.originalPrice && a.originalPrice < a.retailPrice) return no("Original price cannot be lower than retail price.");
      await catalogStore.saveProduct({ id: `${a.gameId}-${Date.now().toString(36)}`, gameId: a.gameId, name: a.name, denomination: a.denomination, currency: "NGN", retailPrice: a.retailPrice, supplierCost: a.supplierCost, supplierProductId: a.supplierProductId, active: true, originalPrice: a.originalPrice || undefined });
      return { ok: true, message: "Denomination added." };
    }
    case "game.update": {
      const g = games.find((x) => x.id === a.id); if (!g) return no("Game not found.");
      if (a.active && !products.some((p) => p.gameId === g.id && p.active)) return no("Add at least one active denomination before enabling this game.");
      await catalogStore.saveGame({ ...g, ...Object.fromEntries(Object.entries(a).filter(([k, v]) => k !== "type" && k !== "id" && v !== undefined)) }); return { ok: true, message: "Game updated." };
    }
    case "game.add": {
      const slug = slugify(a.slug || a.name); if (!slug) return no("Enter a valid name or slug.");
      if (games.some((g) => g.id === slug || g.slug === slug)) return no("A game with that slug already exists.");
      await catalogStore.saveGame({ id: slug, slug, name: a.name, category: a.category, description: a.description ?? `${a.name} top-ups.`, imageUrl: a.imageUrl || undefined, playerFields: [{ key: "playerId", label: a.fieldLabel, pattern: "^\\d{6,12}$", help: `Find your ${a.fieldLabel} on your in-game profile screen.` }], supplierId: "mock", active: false, featured: false, sortOrder: Math.max(0, ...games.map((g) => g.sortOrder)) + 1 }); // hidden until it has a denomination and you enable it
      return { ok: true, message: "Game added (hidden). Add a denomination, then enable it." };
    }
  }
}
