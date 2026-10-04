import { sql } from "../src/lib/db";
import { games, products } from "../src/data/mock";

// Usage: npm run seed (needs DATABASE_URL in .env.local and migrations applied)
(async () => {
  if (!sql) throw new Error("Set DATABASE_URL first");

  console.log("Seeding games into Supabase PostgreSQL...");
  for (const g of games) {
    await sql`
      insert into games (id, slug, name, category, description, image_url, player_fields, supplier_id, active, featured, sort_order)
      values (${g.id}, ${g.slug}, ${g.name}, ${g.category}, ${g.description}, ${g.imageUrl ?? null}, ${sql.json(g.playerFields as never)}, ${g.supplierId}, ${g.active}, ${g.featured}, ${g.sortOrder})
      on conflict (id) do update set
        name = excluded.name,
        slug = excluded.slug,
        category = excluded.category,
        description = excluded.description,
        image_url = excluded.image_url,
        active = excluded.active,
        featured = excluded.featured,
        sort_order = excluded.sort_order
    `;
  }

  console.log("Seeding products into Supabase PostgreSQL...");
  for (const p of products) {
    await sql`
      insert into products (id, game_id, name, denomination, retail_price, original_price, supplier_cost, supplier_product_id, active, popular)
      values (${p.id}, ${p.gameId}, ${p.name}, ${p.denomination}, ${p.retailPrice}, ${p.originalPrice ?? null}, ${p.supplierCost}, ${p.supplierProductId}, ${p.active}, ${!!p.popular})
      on conflict (id) do update set
        name = excluded.name,
        retail_price = excluded.retail_price,
        original_price = excluded.original_price,
        supplier_cost = excluded.supplier_cost,
        active = excluded.active,
        popular = excluded.popular
    `;
  }

  console.log(`✓ Successfully seeded ${games.length} games and ${products.length} products into Supabase.`);
  await sql.end();
})();
