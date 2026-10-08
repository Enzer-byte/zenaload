import Link from "next/link";
import { OpsButton } from "@/components/OpsButton";
import { opsStore } from "@/repositories/opsStore";

export const dynamic = "force-dynamic";

const tone = { info: "text-blue-600", warn: "text-amber-500", error: "text-red-500" };

export default async function Notifications() {
  const list = await opsStore.notices();
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
        {list.some((n) => !n.read) && <OpsButton action="readAll" label="Mark all read" />}
      </div>
      {list.length === 0 ? (
        <p className="rounded-xl border border-[#E0E5F1] bg-white p-5 text-slate-500 shadow-sm">
          No notifications. Alerts about delayed or failed orders and new tickets appear here.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((n) => (
            <li key={n.id} className={`rounded-xl border border-[#E0E5F1] bg-white p-4 shadow-sm ${n.read ? "opacity-60 bg-slate-50" : ""}`}>
              <b className={`${tone[n.level]} font-semibold`}>{n.title}</b>
              <p className="text-sm text-slate-600 mt-1">
                {n.detail}{" "}
                {n.orderId && (
                  <Link className="text-[#1E3BCB] hover:underline ml-1" href={`/admin/orders?q=${n.orderId}`}>
                    View order
                  </Link>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-2">{n.createdAt.slice(0, 16).replace("T", " ")}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
