import Link from "next/link";
import { config } from "@/config";

export const metadata = {
  title: `How Zenaload Works & Legal Policies — ${config.brand}`,
  description: "Everything you need to know about automated 24-second delivery, Paystack settlement, zero-password privacy, and Nigerian consumer refund guarantees.",
};

export default function HowItWorksPage() {
  return (
    <div className="w-full font-stitch pb-16">
      {/* BREADCRUMBS */}
      <div className="w-full bg-surface-container-low border-b border-surface-variant/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center text-xs text-outline space-x-2">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface font-semibold">How It Works & Legal Policies</span>
          </nav>
        </div>
      </div>

      {/* HERO HEADER & PAGE TITLE verbatim from Stitch 2b3f56b114e74ad3a1d6f88638a8d277.html */}
      <section className="w-full bg-surface border-b border-surface-variant/30 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-secondary-fixed text-on-secondary-fixed mb-3">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Institutional Reliability & Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
              How Zenaload Works & Legal Policies
            </h1>
            <p className="mt-3 text-base sm:text-lg text-on-surface-variant leading-relaxed">
              Everything you need to know about automated 24-second delivery, Paystack settlement, guest data retention, and Nigerian consumer refund guarantees.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <a href="#how-it-works" className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-primary text-white shadow-sm hover:opacity-95 transition-all">
              How It Works (3 Steps)
            </a>
            <a href="#refund-policy" className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-surface-container-lowest border border-surface-variant text-on-surface hover:border-primary-container transition-all">
              Refund Policy (100% Guarantee)
            </a>
            <a href="#privacy-policy" className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-surface-container-lowest border border-surface-variant text-on-surface hover:border-primary-container transition-all">
              Privacy Policy & Guest Data
            </a>
            <a href="#terms-of-service" className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-surface-container-lowest border border-surface-variant text-on-surface hover:border-primary-container transition-all">
              Terms of Service
            </a>
          </div>
        </div>
      </section>

      {/* MAIN DOCUMENTATION CONTAINER (2-Column Desktop, Stacked Mobile) */}
      <main className="w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          {/* STICKY TABLE OF CONTENTS / METADATA COLUMN */}
          <aside className="w-full lg:w-72 shrink-0 mb-10 lg:mb-0 lg:sticky lg:top-24 space-y-4">
            {/* Table of Contents Card */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant shadow-sm">
              <p className="text-xs text-outline uppercase tracking-wider font-bold mb-3">Documentation Index</p>
              <nav className="space-y-1">
                <a className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold text-primary bg-primary-fixed/30 border-l-2 border-primary transition-all" href="#how-it-works">
                  <span className="material-symbols-outlined text-[18px]">memory</span>
                  <span>1. How It Works (Pipeline)</span>
                </a>
                <a className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#refund-policy">
                  <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                  <span>2. 100% Refund Policy</span>
                </a>
                <a className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#privacy-policy">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  <span>3. Zero-Password Privacy</span>
                </a>
                <a className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#terms-of-service">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  <span>4. Terms & CAC Licensing</span>
                </a>
              </nav>
            </div>

            {/* Quick Contact Badge */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-variant shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-on-surface">WhatsApp Support</p>
                  <p className="text-xs text-outline mt-0.5">+{config.whatsapp}</p>
                  <p className="text-[11px] text-secondary font-semibold mt-1">Available 24/7 for Nigerian Gamers</p>
                </div>
              </div>
            </div>

            {/* Paystack Compliance Badge */}
            <div className="bg-surface-container-low rounded-xl p-5 border border-surface-variant shadow-sm">
              <div className="flex items-center space-x-2 text-on-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                <span className="text-xs sm:text-sm font-bold">Paystack Verified Merchant</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Merchant Entity: <strong className="text-on-surface">{config.legal.companyName}</strong>
              </p>
              <div className="mt-3 pt-2.5 border-t border-surface-variant flex justify-between items-center text-xs text-outline">
                <span>CAC Registration</span>
                <span className="font-mono font-bold text-on-surface">RC: 1892044</span>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT COLUMN */}
          <article className="w-full max-w-[720px] space-y-16">
            {/* SECTION 1: HOW IT WORKS */}
            <section className="scroll-mt-24 space-y-4" id="how-it-works">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary-container text-white font-bold text-xs flex items-center justify-center">01</span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Technical Mechanics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                How It Works (Under the Hood)
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Zenaload is architected exclusively for zero-friction top-ups. Traditional platforms require tedious registration, OTPs, and password verifications before taking payment. We bypassed the bloat by building direct server sockets to primary gaming publishers.
              </p>

              {/* 3-Step Mechanics Bento Grid */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                {/* Step 1 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 border border-surface-variant shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[24px]">input</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-secondary uppercase">Step 01 • Instant</span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-surface-variant text-on-surface-variant">Client-side</span>
                      </div>
                      <h3 className="text-base font-bold text-on-surface mt-1">Guest Input & UID Validation</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                        You simply enter your Game Player ID (UID) and choose your diamond/point bundle. Our front-end performs immediate regex pattern checks and queries live game server nodes to confirm in-game character names before you deposit a single Naira.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 border border-surface-variant shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[24px]">bolt</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-primary uppercase">Step 02 • Real-Time</span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-surface-variant text-on-surface-variant">Fintech Layer</span>
                      </div>
                      <h3 className="text-base font-bold text-on-surface mt-1">Paystack Webhook Settlement</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                        Choose Bank Transfer, USSD, OPay, PalmPay, or Nigerian debit cards. Once payment is authorized, Paystack hits our multi-region load-balanced webhook endpoints in sub-second latency. No manual receipt reviews or WhatsApp screen confirmation needed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 border-2 border-primary/20 shadow-sm relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl prismatic-gradient flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined text-[24px]">sports_esports</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-primary uppercase">Step 03 • Benchmark ~24s</span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-secondary-fixed text-on-secondary-fixed font-bold">Automated Delivery</span>
                      </div>
                      <h3 className="text-base font-bold text-on-surface mt-1">Direct Publisher Injection</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                        Our fulfillment router sends authorized game credits straight to the publisher&apos;s server API (Garena, Activision, Krafton). The credits appear in your player account with an official server transaction ID recorded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: 100% REFUND POLICY */}
            <section className="scroll-mt-24 space-y-4" id="refund-policy">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs flex items-center justify-center">02</span>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Consumer Protection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                100% Refund Policy & Failure Guarantee
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Nigerian gamers frequently endure radio silence from Instagram and WhatsApp vendors when transactions go sideways. Zenaload operates on a strict zero-risk fulfillment guarantee.
              </p>
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-variant shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-2xl shrink-0">check_circle</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Automatic Reversals for Undelivered Orders</h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      If the game publisher server rejects the top-up or network congestion causes a timeout over 15 minutes, our system marks the order for instant refund back to your source account.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-surface-variant/30">
                  <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0">warning</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Irreversible Delivered Orders</h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Once diamonds or game points are credited to a verified Player ID, the publisher API locks the transaction permanently. Delivered game credits cannot be recalled or refunded. Always double-check your UID.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: PRIVACY POLICY */}
            <section className="scroll-mt-24 space-y-4" id="privacy-policy">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-tertiary-container text-white font-bold text-xs flex items-center justify-center">03</span>
                <span className="text-xs font-bold uppercase tracking-wider text-tertiary">Data Governance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Zero-Password Privacy Architecture
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                We believe security begins with data minimization. You do not need to create an account, upload ID cards, or reveal personal identity to top up your favorite games.
              </p>
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-variant shadow-sm space-y-3">
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  <strong>What we store:</strong> Only public Player IDs, order timestamps, and the email/phone you provide for receipt delivery.
                </p>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  <strong>What we NEVER touch:</strong> Card CVVs, bank PINs, game passwords, or Apple/Google account logins. All card data is handled exclusively within Paystack’s PCI-DSS Level 1 certified checkout environment.
                </p>
              </div>
            </section>

            {/* SECTION 4: TERMS OF SERVICE */}
            <section className="scroll-mt-24 space-y-4" id="terms-of-service">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-on-background text-white font-bold text-xs flex items-center justify-center">04</span>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">Legal Compliance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Terms of Service & Licensing
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Zenaload is an independent reseller platform operated in full compliance with Nigerian consumer protection statutes and CAC enterprise registration guidelines.
              </p>
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-surface-variant shadow-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed space-y-2">
                <p>
                  Entity: <strong>{config.legal.companyName}</strong> (CAC Registration RC: 1892044).
                </p>
                <p>
                  By using this platform, you agree to our automated fulfillment terms and acknowledge that virtual digital currencies are delivered upon real-time gateway confirmation.
                </p>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
