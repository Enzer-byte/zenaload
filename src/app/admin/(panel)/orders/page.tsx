import { catalogStore } from "@/repositories/catalogStore";
import { orderStore } from "@/repositories/orderStore";
import { AdminOrdersFilter } from "@/components/AdminOrdersFilter";

export const dynamic = "force-dynamic";

export default async function Orders() {
  const [games, orders] = await Promise.all([
    catalogStore.games(),
    orderStore.list(500),
  ]);

  const gamesMap = Object.fromEntries(games.map((g) => [g.id, g.name]));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <span className="text-xs text-mute">{orders.length} total orders recorded</span>
      </div>
      <AdminOrdersFilter orders={orders} gamesMap={gamesMap} />
    </div>
  );
}
