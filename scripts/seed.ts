import { sql } from "../src/lib/db";
import { games, products } from "../src/data/mock";
// Usage: npm run seed  (needs DATABASE_URL in .env.local and migrations applied)
(async () => {
  if (!sql) throw new Error("Set DATABASE_URL first");
  for (const g of games) await sql`insert into games (id, slug, name, category, description, player_fields, supplier_id, active, featured, sort_order) values (${g.id}, ${g.slug}, ${g.name}, ${g.category}, ${g.description}, ${sql.json(g.playerFields as never)}, ${g.supplierId}, ${g.active}, ${g.featured}, ${g.sortOrder}) on conflict (id) do update set name = excluded.name, active = excluded.active`;
  for (const p of products) await sql`insert into products (id, game_id, name, denomination, retail_price, supplier_cost, supplier_product_id, active, popular) values (${p.id}, ${p.gameId}, ${p.name}, ${p.denomination}, ${p.retailPrice}, ${p.supplierCost}, ${p.supplierProductId}, ${p.active}, ${!!p.popular}) on conflict (id) do update set retail_price = excluded.retail_price, supplier_cost = excluded.supplier_cost, active = excluded.active`;
  console.log("Seeded", games.length, "games,", products.length, "products"); await sql.end();
})();
