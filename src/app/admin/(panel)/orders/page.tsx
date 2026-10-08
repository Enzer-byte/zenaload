import { catalogStore } from "@/repositories/catalogStore";
import { orderStore } from "@/repositories/orderStore";
import { OrdersTableClient } from "@/components/OrdersTableClient";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

const F: Record<string, (o: Order) => boolean> = { 
  All: () => true, 
  Successful: (o) => o.fulfillment === "SUCCESSFUL", 
  Pending: (o) => ["PROCESSING", "PENDING_REVIEW"].includes(o.fulfillment), 
  Failed: (o) => o.payment === "PAYMENT_FAILED" || o.fulfillment === "FAILED", 
  Refunded: (o) => o.payment === "REFUNDED" 
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const { f = "All", q = "" } = await searchParams;
  const k = q.toLowerCase();

  const [games, products, rawOrders] = await Promise.all([
    catalogStore.games(),
    catalogStore.products(),
    orderStore.list(500),
  ]);

  const gamesMap = Object.fromEntries(games.map((g) => [g.id, g.name]));
  
  const cost = (o: Order) =>
    products.find((p) => p.id === o.productId)?.supplierCost ?? 0;

  const filteredRaw = rawOrders
    .filter((F[f] ?? F.All))
    .filter((o) => !k || [o.id, o.customer.email, o.customer.phone, ...Object.values(o.playerFields)].join(" ").toLowerCase().includes(k));

  const orders = filteredRaw.map(o => {
    const c = cost(o);
    const m = o.amount > 0 ? o.amount - c : 0;
    const mp = o.amount > 0 ? ((m / o.amount) * 100).toFixed(1) : 0;
    
    return {
      raw: o,
      id: o.id,
      game: gamesMap[o.gameId] || o.gameId,
      product: products.find(p => p.id === o.productId)?.name || o.productId,
      price: `₦${o.amount.toLocaleString()}`,
      payStatus: o.payment === "PAID" ? "Paid" : o.payment === "PAYMENT_FAILED" ? "Failed" : "Pending",
      fulfillStatus: o.fulfillment === "SUCCESSFUL" ? "Successful" : o.fulfillment === "PROCESSING" ? "Processing" : o.fulfillment === "PENDING_REVIEW" ? "Pending Review" : o.fulfillment === "FAILED" ? "Failed" : "Pending",
      date: new Date(o.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      customer: o.customer.email.split('@')[0],
      email: o.customer.email,
      phone: o.customer.phone,
      supplier: o.supplierTxId ? "Shop2topup" : "-",
      playerId: Object.values(o.playerFields)[0] || "-",
      cost: `₦${c.toLocaleString()}`,
      margin: `₦${m.toLocaleString()} (${mp}%)`
    };
  });

  return (
    <OrdersTableClient orders={orders} currentFilter={f} currentSearch={q} />
  );
}
