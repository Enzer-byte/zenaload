"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/config";
import { SearchModal } from "@/components/SearchModal";

interface NavbarV2Props {
  currentPath?: string;
}

const navLinks = [
  { href: "/games", label: "Games" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/track-order", label: "Track Order" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
];

const mobileQuickGames = [
  { name: "Free Fire", slug: "free-fire", icon: "🔥", tag: "Diamonds" },
  { name: "Call of Duty Mobile", slug: "call-of-duty-mobile", icon: "🎯", tag: "CP Points" },
  { name: "eFootball", slug: "efootball", icon: "⚽", tag: "Coins" },
  { name: "Blood Strike", slug: "blood-strike", icon: "🩸", tag: "Gold" },
];

export function NavbarV2({ currentPath }: NavbarV2Props) {
  const pathname = usePathname();
  const activeRoute = currentPath || pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Brand & Network Metric Badge */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card/60 text-ink2 hover:border-brand/40 hover:text-white md:hidden active:scale-95 transition-all"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
            aria-label={`${config.brand} Home`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand2 text-lg font-black text-white shadow-md shadow-brand/30 transition-transform group-hover:scale-105">
              Z
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              {config.brand}
              <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">.</span>
            </span>
          </Link>

          {/* Live Network Status Indicator Badge (Visible on tablets and desktops) */}
          <div
            className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 sm:inline-flex"
            role="status"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Instant Delivery: ~24s avg</span>
          </div>
        </div>

        {/* Desktop Navigation Links (md and larger) */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = activeRoute === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive ? "text-hi font-semibold" : "text-ink2"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchModal />
          <Link
            href="/games"
            className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:brightness-110 hover:shadow-brand/40 active:scale-95"
          >
            Top Up Now
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Sheet (Phones & Small Tablets) */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 h-[calc(100vh-4rem)] overflow-y-auto bg-bg/95 backdrop-blur-2xl border-b border-line p-5 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-6 max-w-md mx-auto">
            {/* Live Delivery Status Indicator on Mobile */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Fulfillment System Online</span>
              </div>
              <span className="font-semibold text-emerald-300">~24s avg</span>
            </div>

            {/* Core Navigation Links with touch-friendly 48px height */}
            <div className="space-y-1">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-mute mb-2">
                Menu
              </p>
              {navLinks.map((link) => {
                const isActive = activeRoute === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-brand/15 text-hi border border-brand/30"
                        : "text-ink2 hover:bg-card hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-mute">&rarr;</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Game Top-Ups */}
            <div className="space-y-2 pt-2 border-t border-line/60">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-mute">
                Quick Top-Ups
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mobileQuickGames.map((game) => (
                  <Link
                    key={game.slug}
                    href={`/games/${game.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl border border-line bg-card/70 p-2.5 text-xs transition-colors hover:border-brand/40 active:scale-[0.98]"
                  >
                    <span className="text-lg leading-none">{game.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{game.name}</p>
                      <p className="text-[10px] text-hi">{game.tag}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Prominent Mobile CTA */}
            <div className="pt-2">
              <Link
                href="/games"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand to-brand2 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand/25 active:scale-95"
              >
                Browse All Top-Ups
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
