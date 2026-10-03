import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { config } from "@/config";
import { SearchModal } from "@/components/SearchModal";
export const metadata = { title: `${config.brand} — Game top-ups in Naira`, description: "Buy game credits in Naira with instant delivery." };
const links = [["/games", "Games"], ["/how-it-works", "How It Works"], ["/track-order", "Track Order"], ["/faq", "FAQ"], ["/support", "Support"], ["/account", "Account"]];
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en"><body className="font-sans"><nav className="sticky top-0 z-10 border-b border-line bg-bg/90"><div className="mx-auto flex h-14 max-w-5xl items-center gap-4 overflow-x-auto px-5"><Link href="/" className="text-lg font-semibold">{config.brand}</Link><div className="flex flex-1 gap-4 whitespace-nowrap text-ink2">{links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</div><SearchModal /><Link href="/games" className="whitespace-nowrap rounded-lg bg-brand px-3 py-1.5 text-sm">Top Up Now</Link></div></nav>
  <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
  <footer className="border-t border-line px-5 py-8 pb-24 text-sm text-mute"><div className="mx-auto max-w-5xl"><p className="mb-2 space-x-4 text-ink2">{links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}</p><p className="mb-2 space-x-4 text-ink2"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund-policy">Refund Policy</Link></p><p>{config.legal.companyName} · RC {config.legal.rcNumber} · Support: {config.supportEmail}</p><p>© {new Date().getFullYear()} {config.brand}</p></div></footer>
  <a href={`https://wa.me/${config.whatsapp}`} className="fixed bottom-4 right-4 rounded-full bg-green-700 px-5 py-3 shadow-lg">Support</a></body></html>);
}
