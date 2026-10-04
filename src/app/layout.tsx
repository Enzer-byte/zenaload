import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { config } from "@/config";
import { CustomerShell } from "@/components/CustomerShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
        className={`${inter.className} font-sans bg-bg text-ink min-h-screen flex flex-col antialiased selection:bg-brand selection:text-white`}
        suppressHydrationWarning
      >
        <CustomerShell>{children}</CustomerShell>
      </body>
    </html>
  );
}
