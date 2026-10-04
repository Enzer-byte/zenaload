import Link from "next/link";
import type { ReactNode } from "react";
import { config } from "@/config";

export const metadata = {
  title: `My Account — ${config.brand}`,
  description: "View saved Player IDs and order history on this device.",
};

const navItems = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/player-ids", label: "Saved Player IDs" },
  { href: "/account/loyalty", label: "Rewards" },
  { href: "/account/referrals", label: "Referrals" },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Account Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/75 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg2 px-3 py-1 text-xs text-ink2 mb-2">
              <span>📱</span>
              <span>Local Device Session · No Password Needed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Gamer Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-mute">
              Your recent top-ups and saved Player IDs are securely saved to this device for instant 1-tap checkout.
            </p>
          </div>

          <Link
            href="/games"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand2 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand/25 hover:brightness-110 transition active:scale-95"
          >
            <span>Top Up Games</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav aria-label="Account Tabs" className="mt-6 flex gap-2 overflow-x-auto border-t border-white/5 pt-4 text-xs font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-white/10 bg-bg2/60 px-4 py-2 text-ink2 transition hover:border-brand/40 hover:text-white whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Subview Container */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
