import { sql as db } from "@/lib/db";
import { catalogStore } from "@/repositories/catalogStore";
import type { Order, OrderStore } from "@/types";
const sql = db!;
/* eslint-disable @typescript-eslint/no-explicit-any */
const toOrder = (r: any, events: Order["events"]): Order => ({ id: r.order_reference, gameId: r.game_id, productId: r.product_id, playerFields: r.target_player_fields, customer: { email: r.customer_email, phone: r.customer_phone, whatsapp: r.customer_whatsapp ?? undefined }, amount: Number(r.retail_price_ngn), currency: "NGN", payment: r.payment_status, fulfillment: r.fulfillment_status, paymentRef: r.payment_reference ?? undefined, supplierTxId: r.supplier_reference ?? undefined, errorMessage: r.error_message ?? undefined, retryCount: r.retry_count, createdAt: new Date(r.created_at).toISOString(), updatedAt: new Date(r.updated_at).toISOString(), events });
async function hydrate(r?: any): Promise<Order | null> {
  if (!r) return null;
  const ev = await sql`select at, label from order_events where order_id = ${r.id} order by id`;
  return toOrder(r, ev.map((e: any) => ({ at: new Date(e.at).toISOString(), label: e.label })));
}
async function addEvents(o: Order) { // inserts only events not yet stored
  const [r] = await sql`select id from orders where order_reference = ${o.id}`;
  const [{ c }] = await sql`select count(*)::int as c from order_events where order_id = ${r.id}`;
  for (const e of o.events.slice(c)) await sql`insert into order_events (order_id, label, at) values (${r.id}, ${e.label}, ${e.at})`;
}
export const pgOrderStore: OrderStore = {
  get: async (id) => hydrate((await sql`select * from orders where order_reference = ${id.trim().toUpperCase()}`)[0]),
  getByPaymentRef: async (ref) => hydrate((await sql`select * from orders where payment_reference = ${ref}`)[0]),
  getBySupplierTxId: async (txId) => hydrate((await sql`select * from orders where supplier_reference = ${txId}`)[0]),
  async list(limit = 200) { const rows = await sql`select * from orders order by created_at desc limit ${limit}`; return (await Promise.all(rows.map((r: any) => hydrate(r)))).filter(Boolean) as Order[]; },
  async create(o) {
    const p = (await catalogStore.products()).find((x) => x.id === o.productId)!;
    await sql`insert into orders (order_reference, game_id, product_id, target_player_fields, customer_email, customer_phone, customer_whatsapp, retail_price_ngn, wholesale_cost_ngn, payment_status, fulfillment_status)
      values (${o.id}, ${o.gameId}, ${o.productId}, ${sql.json(o.playerFields)}, ${o.customer.email}, ${o.customer.phone}, ${o.customer.whatsapp ?? null}, ${o.amount}, ${p.supplierCost}, ${o.payment}, ${o.fulfillment})`;
    await addEvents(o);
  },
  async save(o) {
    await sql`update orders set payment_status = ${o.payment}, fulfillment_status = ${o.fulfillment}, payment_reference = ${o.paymentRef ?? null}, supplier_reference = ${o.supplierTxId ?? null}, retry_count = ${o.retryCount ?? 0}, error_message = ${o.errorMessage ?? null}, updated_at = now() where order_reference = ${o.id}`;
    await addEvents(o);
  },
  async claimPaid(ref, label) { // single conditional UPDATE: only one concurrent caller can win
    const [r] = await sql`update orders set payment_status = 'PAID', updated_at = now() where payment_reference = ${ref} and payment_status = 'PAYMENT_PENDING' returning *`;
    const o = await hydrate(r); if (!o) return null;
    o.events.push({ at: new Date().toISOString(), label }); await addEvents(o); return o;
  },
  async withLock(id, fn) { // advisory lock on a reserved connection: no long transaction, committed progress survives failures
    const c = await sql.reserve();
    try {
      const [{ ok }] = await c`select pg_try_advisory_lock(hashtext(${id})) as ok`;
      if (!ok) return;
      try { const o = await pgOrderStore.get(id); if (o) await fn(o); } finally { await c`select pg_advisory_unlock(hashtext(${id}))`; }
    } finally { c.release(); }
  },
};
