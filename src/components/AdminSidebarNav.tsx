"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface AdminSidebarNavProps {
  unreadNotices?: number;
  openTickets?: number;
}

interface NavItem {
  name: string;
  shortName: string;
  href: string;
  exact?: boolean;
  badge?: number;
  badgeTone?: "amber" | "red";
  icon: (active: boolean) => React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

function isRouteActive(pathname: string, href: string, exact = false): boolean {
  if (exact || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({
  unreadNotices = 0,
  openTickets = 0,
}: AdminSidebarNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups: NavGroup[] = [
    {
      label: "Operations",
      items: [
        {
          name: "Dashboard",
          shortName: "Dashboard",
          href: "/admin",
          exact: true,
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          ),
        },
        {
          name: "Live Orders",
          shortName: "Orders",
          href: "/admin/orders",
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Catalogue",
      items: [
        {
          name: "Products & Pricing",
          shortName: "Products",
          href: "/admin/products",
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
          ),
        },
        {
          name: "Games & Visibility",
          shortName: "Games",
          href: "/admin/games",
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="6" x2="10" y1="12" y2="12" />
              <line x1="8" x2="8" y1="10" y2="14" />
              <line x1="15" x2="15.01" y1="13" y2="13" />
              <line x1="18" x2="18.01" y1="11" y2="11" />
              <rect width="20" height="12" x="2" y="6" rx="6" />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Suppliers",
      items: [
        {
          name: "Shop2topup Wholesale",
          shortName: "Shop2topup",
          href: "/admin/suppliers/shop2topup",
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="8" x="2" y="2" rx="2" />
              <rect width="20" height="8" x="2" y="14" rx="2" />
              <line x1="6" x2="6.01" y1="6" y2="6" />
              <line x1="6" x2="6.01" y1="18" y2="18" />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Support & Ops",
      items: [
        {
          name: "Support Tickets",
          shortName: "Tickets",
          href: "/admin/tickets",
          badge: openTickets,
          badgeTone: "amber",
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
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
          ),
        },
        {
          name: "System Alerts",
          shortName: "Alerts",
          href: "/admin/notifications",
          badge: unreadNotices,
          badgeTone: "red",
          icon: (active: boolean) => (
            <svg
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-hi" : "text-mute group-hover:text-ink"
              }`}
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
          ),
        },
      ],
    },
  ];

  const allItems = groups.flatMap((g) => g.items);
  const activeItem = allItems.find((item) =>
    isRouteActive(pathname, item.href, item.exact)
  );
  const totalAlerts = unreadNotices + openTickets;

  const renderBadge = (badge?: number, tone?: "amber" | "red") => {
    if (!badge || badge <= 0) return null;
    if (tone === "red") {
      return (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold font-mono text-red-300 border border-red-500/30 shadow-sm animate-pulse">
          {badge}
        </span>
      );
    }
    return (
      <span className="ml-auto inline-flex items-center justify-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold font-mono text-amber-300 border border-amber-500/30 shadow-sm">
        {badge}
      </span>
    );
  };

  return (
    <>
      {/* Mobile Responsive Navigation (collapsible + horizontal scroller) */}
      <div className="md:hidden space-y-2">
        {/* Mobile Header Bar with Active Indicator & Expand Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-line bg-card/90 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-mute font-medium">Nav:</span>
            <span className="font-semibold text-ink">
              {activeItem ? activeItem.name : "Admin"}
            </span>
            {totalAlerts > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold font-mono text-amber-300 border border-amber-500/30">
                {totalAlerts}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs font-medium text-ink hover:text-white transition-colors"
            aria-expanded={mobileOpen}
          >
            <span>{mobileOpen ? "Close Menu" : "All Sections"}</span>
            <svg
              className={`h-3.5 w-3.5 transition-transform ${
                mobileOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Clean Horizontal Quick Scroller for 1-Tap Mobile Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {allItems.map((item) => {
            const active = isRouteActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap transition-colors ${
                  active
                    ? "bg-brand/20 text-hi font-semibold border border-brand/50 shadow-sm"
                    : "bg-card/80 border border-line text-ink2 hover:text-ink hover:bg-elevated"
                }`}
              >
                {item.icon(active)}
                <span>{item.shortName}</span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold font-mono ${
                      item.badgeTone === "red"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Expanded Mobile Drawer */}
        {mobileOpen && (
          <div className="rounded-xl border border-line bg-card p-3 space-y-4 shadow-xl">
            {groups.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-mute">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isRouteActive(pathname, item.href, item.exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                          active
                            ? "bg-brand/20 text-hi font-semibold border-l-2 border-brand"
                            : "text-ink2 hover:bg-elevated hover:text-ink border-l-2 border-transparent"
                        }`}
                      >
                        {item.icon(active)}
                        <span>{item.name}</span>
                        {renderBadge(item.badge, item.badgeTone)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Vertical Sidebar Navigation */}
      <nav
        aria-label="Admin Navigation"
        className="hidden md:flex md:flex-col gap-5 rounded-2xl border border-line bg-card/70 p-3.5 backdrop-blur-md shadow-xl shadow-black/20"
      >
        {groups.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-mute/80 select-none">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isRouteActive(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs transition-all duration-150 ${
                      active
                        ? "bg-gradient-to-r from-brand/25 via-brand/10 to-transparent text-hi font-semibold border-l-2 border-brand shadow-[inset_0_0_14px_rgba(99,102,241,0.15)]"
                        : "text-ink2 hover:bg-elevated/70 hover:text-ink border-l-2 border-transparent"
                    }`}
                  >
                    {item.icon(active)}
                    <span className="truncate">{item.name}</span>
                    {renderBadge(item.badge, item.badgeTone)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
