import { sql } from "../src/lib/db";
import { catalogStore } from "../src/repositories/catalogStore";
import { orderStore } from "../src/repositories/orderStore";
import { opsStore } from "../src/repositories/opsStore";

async function verifyLiveSupabase() {
  if (!sql) {
    throw new Error("DATABASE_URL not initialized");
  }

  console.log("=== Verifying Live Supabase PostgreSQL Connection ===");

  // 1. Connection Ping & Version
  const [{ version, now }] = await sql`select version(), now()`;
  console.log("✓ Connected to PostgreSQL:", version.split(" ")[0]);
  console.log("✓ Database Server Time (UTC):", now);

  // 2. Verify Games in Catalog
  const games = await catalogStore.games();
  console.log(`✓ Catalog Games: Found ${games.length} games`);
  games.forEach((g) => {
    console.log(`   - ${g.name} (${g.slug}) · ${g.category}`);
  });

  if (games.length === 0) {
    throw new Error("Expected games in database, found 0.");
  }

  // 3. Verify Products in Catalog
  const products = await catalogStore.products();
  console.log(`✓ Catalog Products: Found ${products.length} products`);

  // 4. Test Orders read & write in Postgres
  const testOrderId = `ZL-TEST-${Date.now().toString(16).toUpperCase()}`;
  console.log(`✓ Testing Order lifecycle on Supabase with ID: ${testOrderId}...`);

  await orderStore.create({
    id: testOrderId,
    gameId: games[0].id,
    productId: products[0].id,
    playerFields: { "Player ID": "123456789" },
    customer: { email: "verify@zenaload.com", phone: "+2348012345678" },
    amount: products[0].retailPrice,
    currency: "NGN" as const,
    payment: "UNPAID",
    fulfillment: "NOT_STARTED",
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: [{ at: new Date().toISOString(), label: "Verification order initialized" }],
  });

  const fetchedOrder = await orderStore.get(testOrderId);
  if (!fetchedOrder) {
    throw new Error("Failed to retrieve created order from Supabase");
  }
  console.log(`✓ Order successfully persisted and retrieved: ${fetchedOrder.id} (Status: ${fetchedOrder.payment})`);

  // 5. Test Ops Notification read & write in Postgres
  const testNoticeId = `n-verify-${Date.now()}`;
  await opsStore.addNotice({
    id: testNoticeId,
    level: "info",
    title: "Supabase Migration Verified",
    detail: "Live PostgreSQL connection and repositories verified with 100% health.",
    orderId: testOrderId,
    read: false,
    createdAt: new Date().toISOString(),
  });

  const notices = await opsStore.notices();
  const noticeFound = notices.find((n) => n.id === testNoticeId);
  if (!noticeFound) {
    throw new Error("Failed to retrieve ops notification from Supabase");
  }
  console.log(`✓ Ops Notification successfully stored and retrieved in Supabase`);

  console.log("\n========================================================");
  console.log("🎉 SUPABASE DATABASE IS 100% HEALTHY, PERSISTENT & LIVE!");
  console.log("========================================================");

  await sql.end();
}

verifyLiveSupabase().catch((err) => {
  console.error("✗ Supabase Verification Failed:", err);
  process.exit(1);
});
