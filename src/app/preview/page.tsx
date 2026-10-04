export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { listGamesWithFrom } from "@/lib/gamesWithPrices";
import { HeroV2 } from "@/components/v2/HeroV2";
import { GameCardV2 } from "@/components/v2/GameCardV2";

export default async function PreviewHomePage() {
  const games = await listGamesWithFrom();

  const trustFeatures = [
    {
      icon: "⚡",
      title: "Instant In-Game Delivery",
      metric: "~24s avg speed",
      badgeColor: "border-brand/40 bg-brand/10 text-hi",
      description:
        "Direct publisher API connections automatically credit your game UID within seconds of payment verification. Zero manual delays.",
    },
    {
      icon: "🇳🇬",
      title: "Local Nigerian Naira Payment",
      metric: "Paystack Powered",
      badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      description:
        "Pay seamlessly with any Nigerian Naira debit card (Mastercard, Visa, Verve), instant Bank Transfer, or USSD without FX fees or dollar caps.",
    },
    {
      icon: "🛡️",
      title: "Direct Official Publisher APIs",
      metric: "Zero Password Risk",
      badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      description:
        "We never ask for your game account password or login credentials. Top-ups are safely dispatched using only your public Player ID/UID.",
    },
  ];

  const quickFaqs = [
    {
      q: "How fast is delivery?",
      a: "Our fulfillment system is fully automated. In over 95% of orders, diamonds, CP, or coins reflect in your game account within 24 to 60 seconds after your Naira payment is confirmed.",
    },
    {
      q: "Do I need an account to buy credits?",
      a: "No! Zenaload offers complete guest checkout. Simply pick your game package, enter your public Player ID/UID, pay in Naira, and receive your credits instantly.",
    },
    {
      q: "What if I enter the wrong Player ID?",
      a: "Because top-ups are fulfilled automatically and permanently assigned to the entered UID by official publisher APIs, delivered top-ups cannot be recalled. Always double-check your UID using our in-form guide before checking out.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support all Nigerian bank cards (Mastercard, Visa, Verve), Bank Transfers, and USSD via our secure Paystack integration. You are billed in exact Naira with zero foreign exchange fees.",
    },
    {
      q: "Will my game account be safe from bans?",
      a: "Absolutely. We only use authorized publisher reseller distribution channels. Your account is 100% safe because we never require login credentials or third-party hacks.",
    },
  ];

  return (
    <div className="space-y-20">
      {/* V2 Hero Header */}
      <HeroV2 preview={true} />

      {/* Section 1: Bento-grid Featured Top-Ups */}
      <section aria-labelledby="featured-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-hi">
              <span>🔥</span>
              <span>Trending Now</span>
            </div>
            <h2 id="featured-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Featured Top-Ups
            </h2>
            <p className="mt-1 text-sm text-ink2">
              Select your game, enter your Player ID, and get instant in-game delivery.
            </p>
          </div>

          <Link
            href="/preview/games"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-hi hover:text-white transition-colors"
          >
            <span>Browse All Games</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(({ game, from }) => (
              <GameCardV2 key={game.id} game={game} from={from} preview={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-sm">
            <p className="text-ink2">No games available at the moment. Please check back soon.</p>
          </div>
        )}
      </section>

      {/* Section 2: Why Zenaload Gamer Trust Section */}
      <section aria-labelledby="why-heading" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-card/80 px-3 py-1 text-xs font-semibold text-ink2">
            <span>⚡</span>
            <span>The Gamer Advantage</span>
          </div>
          <h2 id="why-heading" className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Why Nigerian Gamers Choose {config.brand}
          </h2>
          <p className="text-sm text-ink2">
            Engineered to eliminate failed dollar cards, delayed WhatsApp sellers, and security risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustFeatures.map((feat) => (
            <div
              key={feat.title}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-bg2 text-2xl shadow-inner">
                    {feat.icon}
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${feat.badgeColor}`}>
                    {feat.metric}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white sm:text-lg">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-ink2 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/5 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Verified Guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Simple 3-Step Fulfillment Flow */}
      <section aria-labelledby="steps-heading" className="rounded-3xl border border-white/10 bg-gradient-to-b from-card/80 to-bg2/80 p-8 sm:p-10 backdrop-blur-xl">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 id="steps-heading" className="text-xl font-bold text-white sm:text-2xl">
            Top Up in 3 Seamless Steps
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-ink2">
            No signup forms or password sharing required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 border border-brand/40 text-sm font-black text-hi">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Select Your Pack</h3>
            <p className="text-xs text-mute">
              Pick your game and choose the exact diamond or credit denomination.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand2/20 border border-brand2/40 text-sm font-black text-purple-400">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Input Player ID</h3>
            <p className="text-xs text-mute">
              Paste your in-game UID. Use our screenshot guide if you&apos;re unsure.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-sm font-black text-emerald-400">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Pay & Receive</h3>
            <p className="text-xs text-mute">
              Check out via Paystack. Automated delivery completes in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Quick FAQ Accordions */}
      <section aria-labelledby="faq-heading" className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-card/80 px-3 py-1 text-xs font-semibold text-ink2">
            <span>❓</span>
            <span>Got Questions?</span>
          </div>
          <h2 id="faq-heading" className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-ink2">
            Everything you need to know about purchasing game credits on {config.brand}.
          </p>
        </div>

        <div className="space-y-3">
          {quickFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-brand/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm sm:text-base font-semibold text-white">
                <span>{faq.q}</span>
                <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-bg2 text-xs text-ink2 transition-transform duration-200 group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-ink2 leading-relaxed border-t border-white/5 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="text-xs sm:text-sm font-medium text-hi hover:text-white transition-colors"
          >
            Have more questions? Visit our complete FAQ page &rarr;
          </Link>
        </div>
      </section>

      {/* Section 5: Gamer Support Assistance Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-r from-brand/15 via-bg2 to-brand2/15 p-8 sm:p-12 text-center backdrop-blur-xl">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Help Desk Online</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Need Help With a Top-Up?
          </h2>
          <p className="text-xs sm:text-sm text-ink2">
            Have an order question or need assistance finding your UID? Our team responds in minutes on WhatsApp.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all active:scale-95"
            >
              <span>💬</span> Chat on WhatsApp
            </a>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-card px-5 py-3 text-sm font-semibold text-white hover:border-brand/50 hover:bg-elevated transition-all"
            >
              <span>🔍</span> Track Order Status
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
