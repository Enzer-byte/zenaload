import "./globals.css";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { config } from "@/config";
import { CustomerShell } from "@/components/CustomerShell";

const stitchFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-stitch",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export const metadata = {
  title: `${config.brand} — Instant Game Top-Ups in Naira`,
  description:
    "Buy Free Fire Diamonds, CODM CP, and game credits in Naira with instant delivery via Paystack.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${stitchFont.variable} font-stitch bg-surface text-on-surface min-h-screen flex flex-col antialiased selection:bg-secondary-container selection:text-on-background`}
        suppressHydrationWarning
      >
        <CustomerShell>{children}</CustomerShell>
      </body>
    </html>
  );
}
