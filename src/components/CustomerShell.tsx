"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { config } from "@/config";

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin routes: dedicated full-bleed operational layout with zero customer chrome
  if (isAdmin) {
    return (
      <main className="flex-1 w-full min-h-screen bg-surface text-on-surface">
        {children}
      </main>
    );
  }

  // Customer routes: modern fluid layout with responsive max-width and gaming chrome
  return (
    <>
      {/* Exact Stitch Header Component */}
      <NavbarV2 currentPath={pathname ?? undefined} />

      {/* Main Content Area with fluid canvas */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Exact Stitch Footer Component (from Shared Components JSON) */}
      <footer className="w-full py-8 md:py-12 px-4 sm:px-6 md:px-12 bg-on-background border-t border-surface-variant/20 text-surface-container-lowest">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img
                alt="Zenaload"
                className="w-8 h-8 rounded-lg object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VOFgqEf9RJagFErx2Kd_YEY4Z-oktKNnNMoWGKjdnO9GRutDbHOEdp-9seSmGIoFYEqZmxcXwHS4PPfrDeldTiOh_0NMgJpWIvk5bH0F-k66w3dGLJ1laXjq5X7X8ncByVApfXyT-PJkuJYbVxiaLqRq3lHzAv4_1L8gGUWmYHWU9-vA665unC5PfkJ3Daw3qmoGuKCcFUsn_SNp7hSdVTu3tbr6LCX9CYryxcmDmEScc9_PeTZ9I8f2Y"
              />
              <span className="text-xl font-extrabold text-surface-container-lowest tracking-tight">
                {config.brand}
              </span>
            </div>
            <p className="text-sm text-outline-variant max-w-md">
              &copy; {new Date().getFullYear()} {config.brand}. Instant gaming top-ups across Nigeria. Powered by Paystack.
            </p>
            <p className="text-xs text-outline-variant/80">
              Paystack business name: {config.legal.companyName} &bull; 24/7 WhatsApp: +{config.whatsapp}
            </p>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm font-semibold">
            <Link href="/terms" className="text-outline-variant hover:text-surface-container-lowest transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-outline-variant hover:text-surface-container-lowest transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="text-outline-variant hover:text-surface-container-lowest transition-colors">
              Refund Policy
            </Link>
            <Link href="/faq" className="text-outline-variant hover:text-surface-container-lowest transition-colors">
              FAQ
            </Link>
            <Link href="/support" className="text-outline-variant hover:text-surface-container-lowest transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>

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
