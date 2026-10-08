import Link from "next/link";
import { OpsButton } from "@/components/OpsButton";
import { opsStore } from "@/repositories/opsStore";

export const dynamic = "force-dynamic";

export default async function Tickets() {
  const list = await opsStore.tickets();
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Support tickets</h1>
      {list.length === 0 ? (
        <p className="rounded-xl border border-[#E0E5F1] bg-white p-5 text-slate-500 shadow-sm">No tickets yet.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((t) => (
            <li key={t.id} className="rounded-xl border border-[#E0E5F1] bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <b className="text-slate-900">{t.id}</b> ·{" "}
                  <span className={t.open ? "text-amber-500 font-semibold" : "text-emerald-500 font-semibold"}>
                    {t.open ? "Open" : "Resolved"}
                  </span>
                  <p className="text-sm text-slate-600 mt-1">
                    {t.email}
                    {t.orderId && (
                      <>
                        {" "}·{" "}
                        <Link className="text-[#1E3BCB] hover:underline" href={`/admin/orders?q=${t.orderId}`}>
                          {t.orderId}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <OpsButton action={t.open ? "resolve" : "reopen"} id={t.id} label={t.open ? "Resolve" : "Reopen"} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{t.message}</p>
              <p className="mt-2 text-xs text-slate-400">{t.createdAt.slice(0, 16).replace("T", " ")}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
