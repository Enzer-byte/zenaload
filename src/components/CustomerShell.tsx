"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { FooterV2 } from "@/components/v2/FooterV2";
import { config } from "@/config";

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin routes: dedicated full-bleed operational layout with zero customer chrome
  if (isAdmin) {
    return (
      <main className="flex-1 w-full min-h-screen bg-bg text-ink">
        {children}
      </main>
    );
  }

  // Customer routes: modern fluid layout with responsive max-width and gaming chrome
  return (
    <>
      {/* Floating Glassmorphic Gaming Navbar with Mobile Drawer */}
      <NavbarV2 currentPath={pathname ?? undefined} />

      {/* Fluid Page Container: expands gracefully on wide screens and scales down on mobile */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
        {children}
      </main>

      {/* 4-Column Gaming Trust Footer */}
      <FooterV2 />

      {/* Floating WhatsApp Quick Action Button for Gamers */}
      <a
        href={`https://wa.me/${config.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Support on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-950/50 hover:bg-emerald-500 transition-all active:scale-95 border border-emerald-400/20"
      >
        <span>💬</span>
        <span className="hidden sm:inline">WhatsApp Support</span>
      </a>
    </>
  );
}
