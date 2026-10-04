import Link from "next/link";
import { config } from "@/config";

export function FooterV2() {
  return (
    <footer className="border-t border-white/10 bg-bg2/90 backdrop-blur-md mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand column */}
          <div className="md:col-span-1 space-y-3">
            <Link
              href="/"
              className="group flex items-center gap-2"
              aria-label={`${config.brand} Home`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand2 text-base font-black text-white shadow-md shadow-brand/30">
                Z
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                {config.brand}
                <span className="text-hi">.</span>
              </span>
            </Link>
            <p className="text-xs text-mute leading-relaxed">
              Nigeria&apos;s premier instant game credits gateway. Seamless Naira payments, zero account friction, direct in-game fulfillment.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs text-ink2">
              <li>
                <Link href="/games" className="hover:text-hi transition-colors">
                  Browse All Games
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-hi transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-hi transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-hi transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Customer Support</h4>
            <ul className="space-y-2 text-xs text-ink2">
              <li>
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>💬</span> WhatsApp Instant Desk
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${config.supportEmail}`}
                  className="hover:text-hi transition-colors flex items-center gap-1.5"
                >
                  <span>✉️</span> {config.supportEmail}
                </a>
              </li>
              <li>
                <Link href="/support" className="hover:text-hi transition-colors">
                  Submit Support Ticket
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-ink2">
              <li>
                <Link href="/terms" className="hover:text-hi transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-hi transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-hi transition-colors">
                  Refund & Guarantee Policy
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-mute flex items-center gap-1">
                <span>🔒</span> Secured by Paystack · 256-bit SSL
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-mute">
          <p>
            {config.legal.companyName} · RC {config.legal.rcNumber} · Licensed Nigerian Entity
          </p>
          <p>
            &copy; {new Date().getFullYear()} {config.brand}. All trademarks belong to their respective publishers.
          </p>
        </div>
      </div>
    </footer>
  );
}
