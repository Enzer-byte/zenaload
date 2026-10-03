import { newDb } from "pg-mem";
import fs from "fs";

async function main() {
  console.log("Testing Postgres schema & repositories with pg-mem...");
  const db = newDb();

  // Register gen_random_uuid
  db.public.registerFunction({
    name: "gen_random_uuid",
    returns: db.public.getType("uuid" as any),
    implementation: () => "00000000-0000-0000-0000-000000000001",
  });

  const loadSql = (path: string) => {
    let raw = fs.readFileSync(path, "utf-8");
    raw = raw.replace(/--.*$/gm, "");
    return raw
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.toLowerCase().includes("row level security"));
  };

  const initStmts = loadSql("./supabase/migrations/001_init.sql");
  const opsStmts = loadSql("./supabase/migrations/002_ops.sql");

  for (const stmt of initStmts) db.public.none(stmt);
  for (const stmt of opsStmts) db.public.none(stmt);

  console.log("PASS 001_init.sql & 002_ops.sql applied successfully!");

  // 1. Test Seeding Games & Products
  db.public.none(`
    INSERT INTO games (id, slug, name, category, description, player_fields, supplier_id, active, featured, sort_order) 
    VALUES ('free-fire', 'free-fire', 'Free Fire', 'Battle Royale', 'Buy Free Fire Diamonds', '[{"key":"id","label":"Player ID","help":""}]', 'mock', true, true, 1)
  `);

  db.public.none(`
    INSERT INTO products (id, game_id, name, denomination, retail_price, supplier_cost, supplier_product_id, active, popular) 
    VALUES ('free-fire-0', 'free-fire', '100 Credits', 100, 1500, 1410, 'mock-ff-0', true, true)
  `);

  const games = db.public.many(`SELECT * FROM games`);
  const products = db.public.many(`SELECT * FROM products`);
  console.log(`PASS Seeded ${games.length} game(s) and ${products.length} product(s) into Postgres`);

  // 2. Test Order Creation
  const orderRef = "ZL-20261003-TESTPG01";
  db.public.none(`
    INSERT INTO orders (order_reference, game_id, product_id, target_player_fields, customer_email, customer_phone, customer_whatsapp, retail_price_ngn, wholesale_cost_ngn, payment_status, fulfillment_status)
    VALUES ('${orderRef}', 'free-fire', 'free-fire-0', '{"Player ID":"123456789"}', 'user@example.com', '08012345678', NULL, 1500, 1410, 'UNPAID', 'NOT_STARTED')
  `);

  const orderRows = db.public.many(`SELECT * FROM orders WHERE order_reference = '${orderRef}'`);
  if (orderRows.length === 1 && orderRows[0].order_reference === orderRef) {
    console.log("PASS Order created in Postgres:", orderRows[0].order_reference);
  } else {
    throw new Error("Order creation in Postgres failed");
  }

  // 3. Test Order Event Insertion
  const order = orderRows[0];
  db.public.none(`INSERT INTO order_events (order_id, label, at) VALUES ('${order.id}', 'Order created', NOW())`);
  const events = db.public.many(`SELECT * FROM order_events WHERE order_id = '${order.id}'`);
  if (events.length === 1) {
    console.log("PASS Order event recorded in Postgres");
  } else {
    throw new Error("Order event creation failed");
  }

  // 4. Test Webhook Idempotency (webhook_events)
  const provider = "paystack";
  const eventId = "evt_test_123456";
  const res1 = db.public.many(`INSERT INTO webhook_events (provider, event_id) VALUES ('${provider}', '${eventId}') ON CONFLICT DO NOTHING RETURNING id`);
  const res2 = db.public.many(`INSERT INTO webhook_events (provider, event_id) VALUES ('${provider}', '${eventId}') ON CONFLICT DO NOTHING RETURNING id`);

  if (res1.length === 1 && res2.length === 0) {
    console.log("PASS Webhook event idempotency lock working in Postgres");
  } else {
    throw new Error("Webhook idempotency failed");
  }

  // 5. Test Support Ticket & Notification Insertion
  db.public.none(`INSERT INTO support_tickets (id, order_reference, email, subject, message, open) VALUES ('t-1', '${orderRef}', 'user@example.com', 'Help', 'Issue', true)`);
  db.public.none(`INSERT INTO notifications (id, level, title, detail, order_reference, read) VALUES ('n-1', 'info', 'New Order', 'Details', '${orderRef}', false)`);

  const tickets = db.public.many(`SELECT * FROM support_tickets`);
  const notifications = db.public.many(`SELECT * FROM notifications`);
  if (tickets.length === 1 && notifications.length === 1) {
    console.log("PASS Support ticket & Ops notifications created in Postgres");
  } else {
    throw new Error("Ops creation failed");
  }

  // 6. Test Atomic Claim Paid Update (Single UPDATE returning *)
  const claimPaidRes = db.public.many(`
    UPDATE orders SET payment_status = 'PAID', updated_at = NOW() 
    WHERE order_reference = '${orderRef}' AND payment_status = 'UNPAID' 
    RETURNING *
  `);
  if (claimPaidRes.length === 1 && claimPaidRes[0].payment_status === "PAID") {
    console.log("PASS Atomic claimPaid UPDATE query verified in Postgres");
  } else {
    throw new Error("Atomic claimPaid failed");
  }

  console.log("\nALL POSTGRES REPOSITORY QUERY TESTS PASSED!");
}

main().catch((err) => {
  console.error("FAIL PG Check Error:", err);
  process.exit(1);
});
