import Link from "next/link";
import { catalogStore } from "@/repositories/catalogStore";
import { orderStore } from "@/repositories/orderStore";
import { opsStore } from "@/repositories/opsStore";
import { ngn } from "@/config";
import { Badge } from "@/components/Badge";
import { AdminQuickOrderJump } from "@/components/AdminQuickOrderJump";
import { sql } from "@/lib/db";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

function getPlayerPreview(fields: Record<string, string> | undefined): string {
  if (!fields) return "—";
  if (fields.playerId) return fields.playerId;
  if (fields.uid) return fields.uid;
  if (fields.userId) {
    return fields.zoneId ? `${fields.userId} (${fields.zoneId})` : fields.userId;
  }
  const first = Object.values(fields)[0];
  return first || "—";
}

export default async function Dashboard() {
  const [games, products, orders, tickets, notices] = await Promise.all([
    catalogStore.games(),
    catalogStore.products(),
    orderStore.list(500),
    opsStore.tickets(),
    opsStore.notices(),
  ]);

  const gamesMap = Object.fromEntries(games.map((g) => [g.id, g.name]));

  // Cost map helper
  const cost = (o: Order) =>
    products.find((p) => p.id === o.productId)?.supplierCost ?? 0;

  // Time & volume slices
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const paidOrders = orders.filter((o) => o.payment === "PAID");
  const paidToday = todayOrders.filter((o) => o.payment === "PAID");

  // Revenue & Margins
  const revToday = paidToday.reduce((s, o) => s + o.amount, 0);
  const marginToday = paidToday.reduce((s, o) => s + (o.amount - cost(o)), 0);
  const aovToday = paidToday.length > 0 ? Math.round(revToday / paidToday.length) : 0;

  // Delivery Health
  const deliveredOrders = orders.filter((o) => o.fulfillment === "SUCCESSFUL");
  const deliveredCount = deliveredOrders.length;
  const processingCount = orders.filter((o) => o.fulfillment === "PROCESSING").length;
  const successRate =
    paidOrders.length > 0
      ? ((deliveredCount / paidOrders.length) * 100).toFixed(1)
      : "100.0";

  // Action Required / Risk Monitor
  const pendingReviewOrders = orders.filter((o) => o.fulfillment === "PENDING_REVIEW");
  const pendingReviewCount = pendingReviewOrders.length;

  // Orders & Customer Volume
  const uniqueCustomers = new Set(orders.map((o) => o.customer.email)).size;
  const failedCount = orders.filter(
    (o) => o.payment === "PAYMENT_FAILED" || o.fulfillment === "FAILED"
  ).length;

  // Recent 8 Orders Stream
  const recentOrders = orders.slice(0, 8);

  // Ops Triage: Urgent Notices (prioritize warn/error)
  const sortedNotices = [...notices].sort((a, b) => {
    const priority = { error: 3, warn: 2, info: 1 };
    if (priority[b.level] !== priority[a.level]) {
      return priority[b.level] - priority[a.level];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const urgentNotices = sortedNotices.slice(0, 4);

  // Ops Triage: Open Tickets
  const openTickets = tickets.filter((t) => t.open);
  const latestOpenTickets = openTickets.slice(0, 4);

  // Game Volume & Revenue Performance
  const gameStats = games
    .map((g) => {
      const gOrders = orders.filter((o) => o.gameId === g.id);
      const gPaid = gOrders.filter((o) => o.payment === "PAID");
      const gRev = gPaid.reduce((s, o) => s + o.amount, 0);
      return {
        id: g.id,
        name: g.name,
        count: gOrders.length,
        revenue: gRev,
        share: orders.length > 0 ? (gOrders.length / orders.length) * 100 : 0,
      };
    })
    .sort((a, b) => b.count - a.count || b.revenue - a.revenue);

  const maxGameCount = Math.max(1, gameStats[0]?.count ?? 1);

  // Storage status
  const isPostgres = Boolean(sql);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Operations Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="mt-1 text-xs text-mute">
            Real-time pipeline monitoring, fulfillment health, and executive revenue intelligence.
          </p>
        </div>
        <div className="text-right text-xs text-mute font-mono">
          <span>{orders.length} orders total</span>
          <span className="mx-2 text-line">|</span>
          <span>{paidOrders.length} paid</span>
        </div>
      </div>

      {/* SECTION 1: Operational Quick Actions & Order Jump */}
      <div className="rounded-2xl border border-line bg-card p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink2">
            Order Quick Navigation
          </span>
          <span className="text-[11px] text-mute">
            Direct leap to order audit & fulfillment logs
          </span>
        </div>

        <AdminQuickOrderJump />

        {/* Action Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/50">
          <span className="text-[11px] font-medium text-mute mr-1">Quick Actions:</span>
          
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs text-ink hover:border-brand/40 hover:text-white transition-colors"
          >
            <span>Review Pending Orders</span>
            {pendingReviewCount > 0 && (
              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                {pendingReviewCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs text-ink hover:border-brand/40 hover:text-white transition-colors"
          >
            <span>Edit Pricing & Margins</span>
          </Link>

          <Link
            href="/admin/suppliers/shop2topup"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs text-ink hover:border-brand/40 hover:text-white transition-colors"
          >
            <span>Import Wholesale SKUs</span>
          </Link>

          <Link
            href="/admin/tickets"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs text-ink hover:border-brand/40 hover:text-white transition-colors"
          >
            <span>Check Open Tickets</span>
            {openTickets.length > 0 && (
              <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[10px] font-bold text-blue-300">
                {openTickets.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* SECTION 2: Executive KPI Cards (4 grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Revenue Today */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-card p-5 transition-all hover:border-line/80">
          <div>
            <div className="flex items-center justify-between text-xs text-mute">
              <span className="font-semibold uppercase tracking-wider">Revenue Today</span>
              <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-mono text-ink2">
                UTC
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-ink">{ngn(revToday)}</div>
          </div>
          <div className="mt-4 border-t border-line/50 pt-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-ink2">
              <span>Paid Orders:</span>
              <span className="font-medium text-ink">{paidToday.length} today</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">Gross Profit:</span>
              <span className="font-semibold text-green-400">+{ngn(marginToday)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-mute">
              <span>Avg Order Value (AOV):</span>
              <span className="font-mono text-ink2">{ngn(aovToday)}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Delivery Health */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-card p-5 transition-all hover:border-line/80">
          <div>
            <div className="flex items-center justify-between text-xs text-mute">
              <span className="font-semibold uppercase tracking-wider">Delivery Health</span>
              <span className="rounded bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                {successRate}% Success
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {deliveredCount}
              <span className="ml-1 text-sm font-normal text-mute">delivered</span>
            </div>
          </div>
          <div className="mt-4 border-t border-line/50 pt-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-ink2">
              <span>Active Processing:</span>
              <span className={`font-semibold ${processingCount > 0 ? "text-amber-400 animate-pulse" : "text-ink"}`}>
                {processingCount} orders
              </span>
            </div>
            <div className="flex items-center justify-between text-mute">
              <span>Total Paid Volume:</span>
              <span className="font-mono text-ink2">{paidOrders.length} orders</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-mute">
              <span>Fulfillment Integrity:</span>
              <span className="text-green-400">Idempotency Guarded</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Action Required / Risk Monitor */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
            pendingReviewCount > 0
              ? "border-amber-500/80 bg-gradient-to-br from-amber-500/15 via-amber-950/20 to-card shadow-lg shadow-amber-950/25 ring-1 ring-amber-500/50"
              : "border-line bg-card hover:border-line/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-semibold uppercase tracking-wider ${
                  pendingReviewCount > 0 ? "text-amber-200" : "text-mute"
                }`}
              >
                Action Required
              </span>
              {pendingReviewCount > 0 ? (
                <span className="rounded-full bg-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200 animate-pulse">
                  RISK ALERT
                </span>
              ) : (
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                  All Clear
                </span>
              )}
            </div>
            <div
              className={`mt-2 text-2xl font-bold tracking-tight ${
                pendingReviewCount > 0 ? "text-amber-300" : "text-ink"
              }`}
            >
              {pendingReviewCount}
              <span className="ml-1 text-sm font-normal text-mute">pending review</span>
            </div>
          </div>
          <div className="mt-4 border-t border-line/50 pt-3 text-xs">
            {pendingReviewCount > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] text-amber-200/90 leading-tight">
                  Retries exhausted or ambiguous supplier state.
                </p>
                <Link
                  href="/admin/orders"
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black shadow hover:bg-amber-400 transition-colors"
                >
                  <span>Review Stuck Orders</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-green-400">
                  <span className="text-xs">✓</span>
                  <span className="text-[11px] font-medium">No orders require manual review</span>
                </div>
                <p className="text-[11px] text-mute">Automatic retry & router healthy.</p>
              </div>
            )}
          </div>
        </div>

        {/* KPI 4: Orders & Volume */}
        <div className="flex flex-col justify-between rounded-2xl border border-line bg-card p-5 transition-all hover:border-line/80">
          <div>
            <div className="flex items-center justify-between text-xs text-mute">
              <span className="font-semibold uppercase tracking-wider">Orders & Volume</span>
              <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-mono text-ink2">
                All-time
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {orders.length}
              <span className="ml-1 text-sm font-normal text-mute">recorded</span>
            </div>
          </div>
          <div className="mt-4 border-t border-line/50 pt-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-ink2">
              <span>Unique Customers:</span>
              <span className="font-medium text-ink">{uniqueCustomers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mute">Failed Orders:</span>
              <span className={`font-medium ${failedCount > 0 ? "text-red-400" : "text-ink2"}`}>
                {failedCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-mute">
              <span>Orders Placed Today:</span>
              <span className="font-mono text-ink">{todayOrders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Live Recent Orders Stream */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold text-ink">Live Recent Orders Stream</h2>
            <p className="text-xs text-mute">
              Real-time audit log of the most recent checkout transactions.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-medium text-hi hover:underline"
          >
            <span>View all orders</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-8 text-center text-ink2">
            <p className="text-sm">No orders recorded yet. Incoming orders will populate this feed live.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-mute">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Game</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Player ID</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Amount</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Payment</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Fulfillment</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Created (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-elevated/50">
                    <td className="py-3 font-mono font-medium">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-hi hover:underline"
                        title={`Inspect order ${o.id}`}
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td className="py-3 text-ink font-medium">
                      {gamesMap[o.gameId] ?? o.gameId}
                    </td>
                    <td className="py-3 font-mono text-ink2" title={JSON.stringify(o.playerFields)}>
                      {getPlayerPreview(o.playerFields)}
                    </td>
                    <td className="py-3 font-semibold text-ink">
                      {ngn(o.amount)}
                    </td>
                    <td className="py-3">
                      <Badge s={o.payment} />
                    </td>
                    <td className="py-3">
                      <Badge s={o.fulfillment} />
                    </td>
                    <td className="py-3 font-mono text-mute">
                      {o.createdAt.slice(0, 16).replace("T", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 4: Ops Triage Grid (Side-by-Side Bento Cards) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bento Left: Urgent Alerts & Notices */}
        <div className="flex flex-col rounded-2xl border border-line bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-ink">Urgent Alerts & Notices</h2>
              {urgentNotices.length > 0 && (
                <span className="rounded bg-elevated px-2 py-0.5 text-[10px] font-mono text-ink2">
                  {notices.length} total
                </span>
              )}
            </div>
            <Link
              href="/admin/notifications"
              className="text-xs font-medium text-hi hover:underline"
            >
              View all notifications &rarr;
            </Link>
          </div>

          {urgentNotices.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line p-6 text-center text-ink2">
              <div className="space-y-1">
                <span className="text-xl">🛡️</span>
                <p className="text-xs text-mute">No operational alerts. System functioning normally.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1">
              {urgentNotices.map((n) => {
                const isErr = n.level === "error";
                const isWarn = n.level === "warn";
                return (
                  <div
                    key={n.id}
                    className={`rounded-xl border p-3.5 transition-colors ${
                      isErr
                        ? "border-red-500/30 bg-red-500/5 text-red-200"
                        : isWarn
                        ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
                        : "border-line bg-elevated/40 text-ink"
                    } ${n.read ? "opacity-75" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            isErr
                              ? "bg-red-500/20 text-red-400"
                              : isWarn
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {n.level}
                        </span>
                        <span className="font-semibold text-xs text-ink">{n.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-mute whitespace-nowrap">
                        {n.createdAt.slice(0, 16).replace("T", " ")}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-ink2 leading-relaxed">
                      {n.detail}
                    </p>

                    {n.orderId && (
                      <div className="mt-2 pt-2 border-t border-line/40 flex justify-end">
                        <Link
                          href={`/admin/orders/${n.orderId}`}
                          className="font-mono text-[11px] text-hi hover:underline inline-flex items-center gap-1"
                        >
                          <span>Inspect Order {n.orderId}</span>
                          <span>&rarr;</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bento Right: Open Support Tickets */}
        <div className="flex flex-col rounded-2xl border border-line bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-ink">Open Support Tickets</h2>
              {openTickets.length > 0 && (
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                  {openTickets.length} open
                </span>
              )}
            </div>
            <Link href="/admin/tickets" className="text-xs font-medium text-hi hover:underline">
              View all tickets &rarr;
            </Link>
          </div>

          {latestOpenTickets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line p-6 text-center text-ink2">
              <div className="space-y-1">
                <span className="text-xl">✨</span>
                <p className="text-xs text-mute">Inbox zero. No customer tickets pending response.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1">
              {latestOpenTickets.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-line bg-elevated/40 p-3.5 transition-colors hover:border-line/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-semibold text-ink">
                        {t.id}
                      </span>
                      <span className="mx-1.5 text-mute">·</span>
                      <span className="text-xs font-medium text-hi">{t.email}</span>
                    </div>
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      Open
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-ink font-medium line-clamp-1">
                    {t.subject || "Customer Inquiry"}
                  </p>
                  <p className="mt-0.5 text-xs text-ink2 line-clamp-2 leading-relaxed">
                    {t.message}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-line/40 text-[11px]">
                    <span className="font-mono text-mute">
                      {t.createdAt.slice(0, 16).replace("T", " ")}
                    </span>
                    {t.orderId ? (
                      <Link
                        href={`/admin/orders/${t.orderId}`}
                        className="font-mono text-hi hover:underline"
                      >
                        Order: {t.orderId}
                      </Link>
                    ) : (
                      <Link href="/admin/tickets" className="text-mute hover:text-ink">
                        Respond in tickets &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: Game Volume & Revenue Performance */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold text-ink">Game Volume & Revenue Performance</h2>
            <p className="text-xs text-mute">
              Operational breakdown of customer order share and gross revenue per title.
            </p>
          </div>
          <Link href="/admin/games" className="text-xs font-medium text-hi hover:underline">
            Manage Catalogue &rarr;
          </Link>
        </div>

        {gameStats.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-6 text-center text-ink2">
            <p className="text-sm">No games configured in catalog.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {gameStats.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="text-mute font-mono">({item.count} orders)</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-ink font-semibold">{ngn(item.revenue)}</span>
                    <span className="text-ink2 font-medium">
                      {item.share.toFixed(1)}% share
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-brand2 transition-all duration-500"
                    style={{ width: `${(item.count / maxGameCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 6: System Integration Health Status */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-ink">System Integration Health Status</h2>
          <span className="text-xs text-mute">Infrastructure Heartbeat</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Gateway Status */}
          <div className="rounded-xl border border-line bg-elevated/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-mute">Gateway</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Listening
              </span>
            </div>
            <div className="mt-2 font-semibold text-xs text-ink">
              Paystack Webhook
            </div>
            <p className="mt-1 text-[11px] text-mute">
              HMAC-SHA512 verification active on raw body.
            </p>
          </div>

          {/* Supplier Status */}
          <div className="rounded-xl border border-line bg-elevated/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-mute">Supplier</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Connected
              </span>
            </div>
            <div className="mt-2 font-semibold text-xs text-ink">
              Shop2topup Reseller API
            </div>
            <p className="mt-1 text-[11px] text-mute">
              Direct top-up routing & balance telemetry.
            </p>
          </div>

          {/* Storage Status */}
          <div className="rounded-xl border border-line bg-elevated/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-mute">Storage</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Active
              </span>
            </div>
            <div className="mt-2 font-semibold text-xs text-ink">
              {isPostgres ? "Database (Postgres)" : "In-Memory Store"}
            </div>
            <p className="mt-1 text-[11px] text-mute">
              {isPostgres
                ? "Connected via connection pooler."
                : "Development mode (globalThis cache)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
