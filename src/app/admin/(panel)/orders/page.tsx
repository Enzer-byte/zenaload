import Link from "next/link";
import { catalogStore } from "@/repositories/catalogStore";
import { ngn } from "@/config";
import { Badge } from "@/components/Badge";
import { orderStore } from "@/repositories/orderStore";
import type { Order } from "@/types";
const F: Record<string, (o: Order) => boolean> = { All: () => true, Successful: (o) => o.fulfillment === "SUCCESSFUL", Pending: (o) => ["PROCESSING", "PENDING_REVIEW"].includes(o.fulfillment), Failed: (o) => o.payment === "PAYMENT_FAILED" || o.fulfillment === "FAILED", Refunded: (o) => o.payment === "REFUNDED" };
export default async function Orders({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const { f = "All", q = "" } = await searchParams, k = q.toLowerCase();
  const games = await catalogStore.games();
  const list = (await orderStore.list(300)).filter((F[f] ?? F.All)).filter((o) => !k || [o.id, o.customer.email, o.customer.phone, ...Object.values(o.playerFields)].join(" ").toLowerCase().includes(k));
  return (<><h1 className="mb-4 text-2xl font-semibold">Orders</h1><div className="mb-3 flex flex-wrap gap-2">{Object.keys(F).map((x) => <Link key={x} href={`/admin/orders?f=${x}&q=${encodeURIComponent(q)}`} className={`rounded-lg border px-3 py-1.5 text-sm ${x === f ? "border-brand" : "border-line text-ink2"}`}>{x}</Link>)}</div>
  <form className="mb-4"><input type="hidden" name="f" value={f} /><input name="q" defaultValue={q} aria-label="Search orders" placeholder="Search Order ID, Player ID, email or phone" className="w-full rounded-xl border border-line bg-bg2 px-3 py-3" /></form>
  {list.length === 0 ? <p className="rounded-2xl border border-line bg-card p-5 text-ink2">No orders match.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="text-left text-mute"><tr>{["Order", "Customer", "Game", "Amount", "Payment", "Fulfilment", "Date", ""].map((h) => <th key={h} className="p-2 font-normal">{h}</th>)}</tr></thead><tbody>{list.map((o) => <tr key={o.id} className="border-t border-line"><td className="p-2">{o.id}</td><td className="p-2">{o.customer.email}</td><td className="p-2">{games.find((g) => g.id === o.gameId)?.name}</td><td className="p-2">{ngn(o.amount)}</td><td className="p-2"><Badge s={o.payment} /></td><td className="p-2"><Badge s={o.fulfillment} /></td><td className="p-2">{o.createdAt.slice(0, 16).replace("T", " ")}</td><td className="p-2"><Link className="text-hi" href={`/admin/orders/${o.id}`}>View</Link></td></tr>)}</tbody></table></div>}</>);
}
