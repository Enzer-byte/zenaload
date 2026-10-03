import { catalogStore } from "@/repositories/catalogStore";
import { ngn } from "@/config";
import { orderStore } from "@/repositories/orderStore";
export default async function Dashboard() {
  const [games, products] = await Promise.all([catalogStore.games(), catalogStore.products()]);
  const os = await orderStore.list(500), today = new Date().toISOString().slice(0, 10), td = os.filter((o) => o.createdAt.startsWith(today)), paid = (l: typeof os) => l.filter((o) => o.payment === "PAID");
  const cost = (o: (typeof os)[0]) => products.find((p) => p.id === o.productId)?.supplierCost ?? 0, rev = paid(td).reduce((s, o) => s + o.amount, 0), margin = paid(td).reduce((s, o) => s + o.amount - cost(o), 0);
  const m: [string, string | number][] = [["Revenue today (UTC)", ngn(rev)], ["Orders today", td.length], ["Successful", os.filter((o) => o.fulfillment === "SUCCESSFUL").length], ["Pending", os.filter((o) => ["PROCESSING", "PENDING_REVIEW"].includes(o.fulfillment)).length], ["Failed", os.filter((o) => o.payment === "PAYMENT_FAILED" || o.fulfillment === "FAILED").length], ["Customers", new Set(os.map((o) => o.customer.email)).size], ["Gross margin today", ngn(margin)]];
  const top = games.map((g) => [g.name, os.filter((o) => o.gameId === g.id).length] as const).sort((a, b) => b[1] - a[1]), mx = Math.max(1, top[0][1]);
  return (<><h1 className="mb-4 text-2xl font-semibold">Dashboard</h1><div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">{m.map(([l, v]) => <div key={l} className="rounded-2xl border border-line bg-card p-4"><div className="text-xs text-mute">{l}</div><div className="text-xl font-semibold">{v}</div></div>)}</div>
  {os.length === 0 ? <p className="rounded-2xl border border-line bg-card p-5 text-ink2">No orders yet. Orders appear here as customers check out.</p> : <div className="rounded-2xl border border-line bg-card p-5"><h2 className="mb-3 font-medium">Orders by game</h2>{top.map(([n, c]) => <div key={n} className="mb-2 text-sm"><div className="flex justify-between text-ink2"><span>{n}</span><span>{c}</span></div><div className="h-2 rounded bg-elevated"><div className="h-2 rounded bg-brand" style={{ width: `${(c / mx) * 100}%` }} /></div></div>)}</div>}</>);
}
