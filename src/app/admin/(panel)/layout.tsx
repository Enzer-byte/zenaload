import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/adminAuth";
import { AdminHeaderBalance } from "@/components/AdminHeaderBalance";
import { AdminSidebarNav } from "@/components/AdminSidebarNav";
import { opsStore } from "@/repositories/opsStore";
import { sql } from "@/lib/db";
import { config } from "@/config";

export const dynamic = "force-dynamic";

export default async function Panel({ children }: { children: ReactNode }) {
  await requireAdmin();

  const [notices, tickets] = await Promise.all([
    opsStore.notices(),
    opsStore.tickets(),
  ]);

  const unreadNotices = notices.filter((n) => !n.read).length;
  const openTickets = tickets.filter((t) => t.open).length;
  const isPostgresLive = Boolean(sql);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Bar */}
      <header className="rounded-2xl border border-line bg-card/85 p-4 sm:p-5 backdrop-blur-md shadow-xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Brand & Mode Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand via-brand2 to-violet-700 shadow-md shadow-brand/25 ring-1 ring-white/10">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="m2 17 10 5 10-5" />
                  <path d="m2 12 10 5 10-5" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold tracking-tight text-ink">
                    {config.brand} Admin Console
                  </h1>
                  {isPostgresLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      POSTGRES LIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      MOCK SANDBOX
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-mute">
                  Live Operations, Catalogue Management &amp; Fulfillment Control
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions: Alerts, Tickets, Balance, Store Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Direct Link to Support Tickets with Badge Pill */}
            <Link
              href="/admin/tickets"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card/90 px-3 py-1.5 text-xs font-medium text-ink2 hover:border-line/80 hover:bg-elevated hover:text-ink transition-colors"
              title="View Support Tickets"
            >
              <svg
                className="h-3.5 w-3.5 text-mute"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
              <span>Tickets</span>
              {openTickets > 0 && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold font-mono text-amber-300 border border-amber-500/30">
                  {openTickets}
                </span>
              )}
            </Link>

            {/* Direct Link to System Alerts with Badge Pill */}
            <Link
              href="/admin/notifications"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card/90 px-3 py-1.5 text-xs font-medium text-ink2 hover:border-line/80 hover:bg-elevated hover:text-ink transition-colors"
              title="View System Alerts"
            >
              <svg
                className="h-3.5 w-3.5 text-mute"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span>Alerts</span>
              {unreadNotices > 0 && (
                <span className="rounded-full bg-red-500/20 px-1.5 py-0.2 text-[10px] font-bold font-mono text-red-300 border border-red-500/30 animate-pulse">
                  {unreadNotices}
                </span>
              )}
            </Link>

            {/* Supplier Live Balance Widget with Refresh and Low-Balance Alert */}
            <AdminHeaderBalance />

            {/* Quick Store Switcher: View Live Store ↗ */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-hi hover:bg-brand/20 hover:border-brand/60 transition-colors shadow-sm"
              title="Open storefront in new tab"
            >
              <span>View Live Store</span>
              <span className="text-xs">↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Body: Left Sidebar + Main Content Area */}
      <div className="grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] items-start">
        <aside className="w-full md:sticky md:top-6">
          <AdminSidebarNav unreadNotices={unreadNotices} openTickets={openTickets} />
        </aside>

        {/* Main Content Area with Smooth Card Styling */}
        <main className="min-w-0 w-full rounded-2xl border border-line/60 bg-card/40 p-4 sm:p-6 backdrop-blur-sm shadow-xl shadow-black/10">
          {children}
        </main>
      </div>
    </div>
  );
}
