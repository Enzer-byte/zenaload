import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/adminAuth";
export const dynamic = "force-dynamic";
export default async function Panel({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (<div className="grid gap-6 md:grid-cols-[170px_1fr]"><aside className="flex gap-2 overflow-x-auto text-ink2 md:flex-col">{[["/admin", "Dashboard"], ["/admin/orders", "Orders"], ["/admin/products", "Products"], ["/admin/games", "Games"], ["/admin/notifications", "Notifications"], ["/admin/tickets", "Support tickets"]].map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-elevated">{l}</Link>)}</aside><div className="min-w-0">{children}</div></div>);
}
