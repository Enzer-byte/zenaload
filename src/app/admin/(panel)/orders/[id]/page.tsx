import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogStore } from "@/repositories/catalogStore";
import { ngn } from "@/config";
import { Badge } from "@/components/Badge";
import { OrderActions } from "@/components/OrderActions";
import { orderStore } from "@/repositories/orderStore";
export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const o = await orderStore.get((await params).id); if (!o) notFound();
  const [games, products] = await Promise.all([catalogStore.games(), catalogStore.products()]);
  const p = products.find((x) => x.id === o.productId), row = (l: string, v: React.ReactNode) => <div className="flex justify-between gap-4 border-b border-line py-2 text-sm"><span className="text-ink2">{l}</span><span className="text-right">{v}</span></div>;
  return (<><Link href="/admin/orders" className="text-sm text-mute">← Orders</Link><h1 className="my-2 text-2xl font-semibold">{o.id}</h1>
  <div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-line bg-card p-5"><h2 className="mb-2 font-medium">Order</h2>{row("Game / product", `${games.find((g) => g.id === o.gameId)?.name} · ${p?.name}`)}{Object.entries(o.playerFields).map(([k, v]) => row(k, v))}{row("Amount", ngn(o.amount))}{row("Supplier cost", ngn(p?.supplierCost ?? 0))}{row("Payment", <Badge s={o.payment} />)}{row("Fulfilment", <Badge s={o.fulfillment} />)}{row("Payment ref", o.paymentRef ?? "—")}{row("Supplier ref", o.supplierTxId ?? "—")}{row("Attempts", o.retryCount ?? 0)}{row("Customer", `${o.customer.email} · ${o.customer.phone}`)}{o.errorMessage && row("Error", o.errorMessage)}</div>
  <div className="space-y-4"><OrderActions id={o.id} /><div className="rounded-2xl border border-line bg-card p-5"><h2 className="mb-2 font-medium">Timeline and notes</h2><ul className="space-y-1 text-sm text-ink2">{o.events.map((e, i) => <li key={i}>{e.at.slice(0, 19).replace("T", " ")} · {e.label}</li>)}</ul></div></div></div></>);
}
