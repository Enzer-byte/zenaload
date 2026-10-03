import { sql as db } from "@/lib/db";
import type { CatalogStore, Game, Product } from "@/types";
const sql = db!;
/* eslint-disable @typescript-eslint/no-explicit-any */
const toGame = (r: any): Game => ({ id: r.id, slug: r.slug, name: r.name, category: r.category, description: r.description ?? "", playerFields: r.player_fields, supplierId: r.supplier_id, active: r.active, featured: r.featured, sortOrder: r.sort_order });
const toProduct = (r: any): Product => ({ id: r.id, gameId: r.game_id, name: r.name, denomination: r.denomination, currency: "NGN", retailPrice: Number(r.retail_price), supplierCost: Number(r.supplier_cost), supplierProductId: r.supplier_product_id, active: r.active, featured: r.featured, popular: r.popular });
export const pgCatalog: CatalogStore = {
  games: async () => (await sql`select * from games order by sort_order, name`).map(toGame),
  products: async () => (await sql`select * from products order by game_id, retail_price`).map(toProduct),
  async saveGame(g) { await sql`insert into games (id, slug, name, category, description, player_fields, supplier_id, active, featured, sort_order) values (${g.id}, ${g.slug}, ${g.name}, ${g.category}, ${g.description}, ${sql.json(g.playerFields as never)}, ${g.supplierId}, ${g.active}, ${g.featured}, ${g.sortOrder}) on conflict (id) do update set slug = excluded.slug, name = excluded.name, category = excluded.category, description = excluded.description, player_fields = excluded.player_fields, supplier_id = excluded.supplier_id, active = excluded.active, featured = excluded.featured, sort_order = excluded.sort_order`; },
  async saveProduct(p) { await sql`insert into products (id, game_id, name, denomination, retail_price, supplier_cost, supplier_product_id, active, featured, popular) values (${p.id}, ${p.gameId}, ${p.name}, ${p.denomination}, ${p.retailPrice}, ${p.supplierCost}, ${p.supplierProductId}, ${p.active}, ${!!p.featured}, ${!!p.popular}) on conflict (id) do update set name = excluded.name, denomination = excluded.denomination, retail_price = excluded.retail_price, supplier_cost = excluded.supplier_cost, supplier_product_id = excluded.supplier_product_id, active = excluded.active, featured = excluded.featured, popular = excluded.popular`; },
};
