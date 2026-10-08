import type { ReactNode } from "react";
import Link from "next/link";
import { config } from "@/config";
import { PreviewBanner } from "@/components/v2/PreviewBanner";
import { NavbarV2 } from "@/components/v2/NavbarV2";

export const metadata = {
  title: `${config.brand} (Stitch Preview) — Instant Game Top-Up Nigeria`,
  description: "Preview the exact Google Stitch design system on Zenaload.",
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-preview-root
      className="min-h-screen flex flex-col bg-surface text-on-surface antialiased font-stitch selection:bg-secondary-container selection:text-on-background"
    >
      {/* Suppress original V1 shell elements */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body:has([data-preview-root]) > nav { display: none !important; }
            body:has([data-preview-root]) > footer { display: none !important; }
            body:has([data-preview-root]) > a[href*="wa.me"] { display: none !important; }
            body:has([data-preview-root]) > main { max-width: 100% !important; padding: 0 !important; }
          `,
        }}
      />

      {/* Floating Preview Banner */}
      <PreviewBanner />

      {/* Exact Stitch Header Component */}
      <NavbarV2 />

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
    </div>
  );
}
