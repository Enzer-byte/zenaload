import Link from "next/link";
import { config } from "@/config";

export const metadata = {
  title: `Support & FAQ — ${config.brand} (Stitch Preview)`,
  description: "Instant resolution for diamond deliveries, wrong Player IDs, or Paystack payment confirmations.",
};

export default function PreviewSupportPage() {
  return (
    <div className="w-full font-stitch pb-16">
      {/* HERO SECTION verbatim from Stitch 0a06521336e64f478187f73f635e1388.html */}
      <section className="relative bg-surface-container-low border-b border-surface-variant pt-8 pb-12 overflow-hidden px-4 sm:px-6 md:px-12">
        {/* Ambient light effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Breadcrumb & Desk Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <nav className="flex items-center gap-2 text-outline text-xs sm:text-sm">
              <Link href="/preview" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Support & FAQ</span>
            </nav>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-on-secondary-container text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
              <span>⚡ 24/7 LAGOS RESOLUTION DESK</span>
            </div>
          </div>

          {/* Headline & Subhead */}
          <div className="text-center max-w-2xl mx-auto mt-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-3">
              How can we help your top-up?
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Instant resolution for diamond deliveries, wrong Player IDs, or Paystack payment confirmations. No ticket delays.
            </p>
          </div>

          {/* High-Performance Guest Search Input */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <form action="/preview/support" method="GET" className="relative flex items-center shadow-lg rounded-xl overflow-hidden border-2 border-primary-container bg-surface-container-lowest">
              <div className="pl-4 text-primary">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <input
                name="q"
                type="text"
                placeholder="Search issues, error messages, or questions (e.g. debited but pending, wrong UID)..."
                className="w-full h-14 pl-3 pr-28 bg-transparent text-on-surface placeholder:text-outline text-sm focus:outline-none border-none ring-0 focus:ring-0"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-lg brand-gradient text-white text-xs sm:text-sm font-bold brand-glow active:scale-95 transition-transform"
              >
                Resolve
              </button>
            </form>

            {/* Quick Tags */}
            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center text-outline text-xs">
              <span>Popular:</span>
              <a href="#common-issues" className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-variant transition-colors text-on-surface">
                Debited but Pending
              </a>
              <a href="#common-issues" className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-variant transition-colors text-on-surface">
                Wrong Free Fire UID
              </a>
              <a href="#common-issues" className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-variant transition-colors text-on-surface">
                OPay / PalmPay Transfer
              </a>
            </div>
          </div>

          {/* Trust Metric Banner verbatim from Stitch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-2">
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-surface-container-lowest/80 backdrop-blur-sm border border-surface-variant/70 rounded-xl p-3 shadow-sm">
              <span className="material-symbols-outlined text-primary-container text-[22px]">bolt</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">4.2 min avg</p>
                <p className="text-[11px] text-outline">WhatsApp Desk Reply</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-surface-container-lowest/80 backdrop-blur-sm border border-surface-variant/70 rounded-xl p-3 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">100% Refund</p>
                <p className="text-[11px] text-outline">Undelivered Guarantee</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-surface-container-lowest/80 backdrop-blur-sm border border-surface-variant/70 rounded-xl p-3 shadow-sm">
              <span className="material-symbols-outlined text-tertiary text-[22px]">lock</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-on-surface">Paystack Verified</p>
                <p className="text-[11px] text-outline">Licensed Fintech Rail</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMMON ISSUES / BENTO TRIAGE GRID verbatim from Stitch */}
      <section className="py-12 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12" id="common-issues">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Fast Self-Service</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">Instant Triage & Direct Fixes</h2>
          </div>
          <p className="text-xs sm:text-sm text-outline max-w-md">
            92% of order hold-ups can be unblocked immediately without waiting for an agent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Bank Debited But Waiting */}
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 flex flex-col justify-between border border-surface-variant shadow-sm hover:border-primary-container transition-all group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">Most Common</span>
              <h3 className="text-base font-bold text-on-surface mb-2">My bank was debited, but order says &quot;Waiting&quot;</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
                Nigerian NIBSS settlement webhooks occasionally lag by 60-120 seconds. Enter your Paystack RRN or account session to trigger forced reconciliation.
              </p>
            </div>
            <Link
              href="/preview/track-order"
              className="w-full py-2.5 px-4 rounded-xl border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Verify Transaction Now</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Card 2: Wrong Player ID */}
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 flex flex-col justify-between border border-surface-variant shadow-sm hover:border-primary-container transition-all group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-error border border-red-200 mb-2">Urgent Action</span>
              <h3 className="text-base font-bold text-on-surface mb-2">Entered the wrong Player ID or Server</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
                Automated publisher bots dispatch in 24 seconds. If your order status is still &quot;Queued&quot;, tap immediately to freeze distribution to the wrong gamer tag.
              </p>
            </div>
            <a
              href={`https://wa.me/${config.whatsapp}?text=URGENT%3A%20Stop%20order%20with%20wrong%20UID`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl brand-gradient text-white text-xs font-bold flex items-center justify-center gap-2 brand-glow active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Contact Urgent Desk</span>
            </a>
          </div>

          {/* Card 3: Diamonds Delay */}
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 flex flex-col justify-between border border-surface-variant shadow-sm hover:border-primary-container transition-all group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">diamond</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-secondary border border-cyan-200 mb-2">Delivery Guide</span>
              <h3 className="text-base font-bold text-on-surface mb-2">Diamonds haven&apos;t reflected after 5 minutes</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
                Restart your game app to force the publisher wallet refresh. If diamonds are still missing, run our direct server-to-server check.
              </p>
            </div>
            <Link
              href="/preview/track-order"
              className="w-full py-2.5 px-4 rounded-xl border border-surface-variant bg-surface text-on-surface text-xs font-bold hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              <span>Direct API Re-check</span>
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: DIRECT ESCALATION HUB (HIGH CONTRAST WHATSAPP / LAGOS DESK verbatim from Stitch) */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 mb-16">
        <div className="bg-on-background text-surface-container-lowest rounded-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">support_agent</span>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/10 text-secondary-container text-xs font-bold mb-3 border border-secondary-container/30">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                <span>HUMAN GAMING SPECIALISTS ON STANDBY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-surface-container-lowest tracking-tight mb-3">
                Need immediate live human intervention?
              </h2>
              <p className="text-xs sm:text-sm text-outline-variant mb-5 max-w-xl leading-relaxed">
                Connect directly with our Victoria Island, Lagos operations squad on WhatsApp. We provide priority handling for pending debits, stuck orders, or distributor errors.
              </p>
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs text-outline-variant mb-6">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary-container text-[16px]">schedule</span> Operating 24 Hours / 7 Days</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary-container text-[16px]">verified</span> RC: 1892044 ({config.legal.companyName})</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary-container text-[16px]">payments</span> Instant Reversals</span>
              </div>
              {/* WhatsApp Template Pill */}
              <div className="p-3 bg-surface-container-lowest/5 rounded-xl border border-surface-variant/20 inline-block w-full max-w-md">
                <p className="text-[11px] text-outline-variant uppercase mb-1 font-bold">Pre-filled Message Template:</p>
                <p className="text-xs text-secondary-fixed-dim font-mono italic">
                  &quot;Hello Zenaload Support, I need help with Order Ref: [ZL-XXXXX]...&quot;
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                className="w-full min-h-[56px] rounded-xl brand-gradient text-white text-sm sm:text-base font-extrabold flex items-center justify-center gap-3 brand-glow hover:brightness-105 active:scale-98 transition-all"
                href={`https://wa.me/${config.whatsapp}?text=Hello%20Zenaload%20Support%2C%20I%20need%20help%20with%20my%20top-up`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[24px]">chat</span>
                <span>Open WhatsApp Live Desk</span>
              </a>
              <div className="text-center">
                <span className="text-xs text-outline-variant">Official WhatsApp Helpline:</span>
                <p className="text-base sm:text-lg text-surface-container-lowest font-bold mt-0.5">+{config.whatsapp}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-lowest/5 border border-surface-variant/10 text-center">
                <span className="text-xs text-outline-variant">Average resolution speed today: <strong className="text-secondary-container font-bold">3 mins 48 secs</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMPREHENSIVE FAQ ACCORDION verbatim from Stitch */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-wider text-primary font-bold">Clear Transparency</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">Frequently Answered Questions</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            Everything you need to know about guest checkouts, Paystack safety, and game diamond delivery.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          <details className="group bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden transition-all duration-200 open:border-primary-container" open>
            <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none select-none text-sm sm:text-base font-bold text-on-surface">
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                <span>Which Nigerian payment methods confirm fastest on Zenaload?</span>
              </span>
              <span className="material-symbols-outlined text-outline transition-transform duration-200 group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-on-surface-variant text-xs sm:text-sm border-t border-surface-variant/40 mt-1 space-y-2 leading-relaxed">
              <p>
                <strong>OPay, PalmPay, and Instant Bank Transfers (Wema/Titan dynamic virtual accounts)</strong> confirm within 3 to 10 seconds through Paystack’s low-latency API hooks.
              </p>
              <p>
                Mastercard, Visa, and Verve card debits are also instant. USSD (e.g. *737#, *894#) may experience brief network dips depending on local telecom congestion in Nigeria.
              </p>
            </div>
          </details>

          <details className="group bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden transition-all duration-200 open:border-primary-container">
            <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none select-none text-sm sm:text-base font-bold text-on-surface">
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">security</span>
                <span>Do you ever ask for my game password or email account login?</span>
              </span>
              <span className="material-symbols-outlined text-outline transition-transform duration-200 group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-on-surface-variant text-xs sm:text-sm border-t border-surface-variant/40 mt-1 space-y-2 leading-relaxed">
              <p className="font-bold text-error">
                NEVER. Zenaload strictly operates on zero-credential top-ups.
              </p>
              <p>
                We only require your public Game User ID (UID) and Server Zone (for games like Free Fire, Mobile Legends, and CODM). We will never ask for your Google account, Apple ID, Facebook, or game password. Anyone asking for these claiming to represent Zenaload is an imposter.
              </p>
            </div>
          </details>

          <details className="group bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden transition-all duration-200 open:border-primary-container">
            <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none select-none text-sm sm:text-base font-bold text-on-surface">
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">timer</span>
                <span>How does the 24-second delivery pipeline work?</span>
              </span>
              <span className="material-symbols-outlined text-outline transition-transform duration-200 group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-on-surface-variant text-xs sm:text-sm border-t border-surface-variant/40 mt-1 leading-relaxed">
              <p>
                Once Paystack notifies our backend that your payment has landed, our direct distributor API triggers the publisher voucher server. The diamonds or CP are injected directly into your server character mailbox automatically.
              </p>
            </div>
          </details>

          <details className="group bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden transition-all duration-200 open:border-primary-container">
            <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none select-none text-sm sm:text-base font-bold text-on-surface">
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">undo</span>
                <span>What is the 100% Refund Policy on failed top-ups?</span>
              </span>
              <span className="material-symbols-outlined text-outline transition-transform duration-200 group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-on-surface-variant text-xs sm:text-sm border-t border-surface-variant/40 mt-1 leading-relaxed">
              <p>
                If a game server is undergoing maintenance or an order fails to deliver after payment, our system automatically routes the transaction to our review queue. If fulfillment cannot be completed within 15 minutes, a 100% refund is initiated back to your original payment method.
              </p>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
