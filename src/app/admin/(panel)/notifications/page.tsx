import Link from "next/link";
import { OpsButton } from "@/components/OpsButton";
import { opsStore } from "@/repositories/opsStore";
const tone = { info: "text-ink2", warn: "text-amber-400", error: "text-red-400" };
export default async function Notifications() {
  const list = await opsStore.notices();
  return (<><div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-semibold">Notifications</h1>{list.some((n) => !n.read) && <OpsButton action="readAll" label="Mark all read" />}</div>
  {list.length === 0 ? <p className="rounded-2xl border border-line bg-card p-5 text-ink2">No notifications. Alerts about delayed or failed orders and new tickets appear here.</p> : <ul className="space-y-2">{list.map((n) => <li key={n.id} className={`rounded-2xl border border-line bg-card p-4 ${n.read ? "opacity-60" : ""}`}><b className={tone[n.level]}>{n.title}</b><p className="text-sm text-ink2">{n.detail} {n.orderId && <Link className="text-hi" href={`/admin/orders/${n.orderId}`}>View order</Link>}</p><p className="text-xs text-mute">{n.createdAt.slice(0, 16).replace("T", " ")}</p></li>)}</ul>}</>);
}
