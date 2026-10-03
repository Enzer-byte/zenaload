import { games as g0, products as p0 } from "@/data/mock";
import type { CatalogStore, Game, Product } from "@/types";
const G = globalThis as unknown as { __cat?: { games: Game[]; products: Product[] } };
const c = (G.__cat ??= { games: structuredClone(g0), products: structuredClone(p0) }); // editable copy of the mock catalogue
const up = <T extends { id: string }>(l: T[], x: T) => { const i = l.findIndex((y) => y.id === x.id); if (i >= 0) l[i] = structuredClone(x); else l.push(structuredClone(x)); };
export const memoryCatalog: CatalogStore = { games: async () => structuredClone(c.games), products: async () => structuredClone(c.products), saveGame: async (g) => up(c.games, g), saveProduct: async (p) => up(c.products, p) };
