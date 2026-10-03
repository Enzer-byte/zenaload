import Link from "next/link";
import { OpsButton } from "@/components/OpsButton";
import { opsStore } from "@/repositories/opsStore";
export default async function Tickets() {
  const list = await opsStore.tickets();
  return (<><h1 className="mb-4 text-2xl font-semibold">Support tickets</h1>{list.length === 0 ? <p className="rounded-2xl border border-line bg-card p-5 text-ink2">No tickets yet.</p> : <ul className="space-y-3">{list.map((t) => <li key={t.id} className="rounded-2xl border border-line bg-card p-4"><div className="flex items-start justify-between gap-3"><div><b>{t.id}</b> · <span className={t.open ? "text-amber-400" : "text-green-400"}>{t.open ? "Open" : "Resolved"}</span><p className="text-sm text-ink2">{t.email}{t.orderId && <> · <Link className="text-hi" href={`/admin/orders/${t.orderId}`}>{t.orderId}</Link></>}</p></div><OpsButton action={t.open ? "resolve" : "reopen"} id={t.id} label={t.open ? "Resolve" : "Reopen"} /></div><p className="mt-2 whitespace-pre-wrap text-sm">{t.message}</p><p className="mt-1 text-xs text-mute">{t.createdAt.slice(0, 16).replace("T", " ")}</p></li>)}</ul>}</>);
}
