export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { listGamesWithFrom } from "@/lib/gamesWithPrices";
import { GameCardV2 } from "@/components/v2/GameCardV2";

export default async function HomePage() {
  const games = await listGamesWithFrom();

  return (
    <div className="pb-16 w-full">
      {/* HERO SECTION: Full width dark background with radial glow (verbatim from Stitch 7d9305c45e964820bc9e4d3684602fb5.html) */}
      <section className="bg-[#0A1236] text-surface-container-lowest pt-10 sm:pt-14 md:pt-16 pb-16 sm:pb-20 md:pb-24 relative overflow-hidden hero-glow -mx-4 sm:-mx-6 md:-mx-12 px-4 sm:px-6 md:px-12">

        <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
          {/* Delivery Guarantee Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-secondary-container font-label-md text-xs sm:text-sm font-bold mb-5 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            <span>Automated Instant Top-up</span>
          </div>

          {/* Headline verbatim from Stitch */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface-container-lowest max-w-4xl mx-auto leading-tight md:leading-[1.15]">
            Game credit in about 24 seconds. Paid in naira.
          </h1>

          {/* Supporting Copy verbatim from Stitch */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-outline-variant leading-relaxed max-w-2xl mx-auto font-medium">
            Top up Free Fire, Call of Duty: Mobile, eFootball and more. Pay by card, bank transfer or USSD. No account needed.
          </p>

          {/* 3 Key Trust Points */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-3 sm:gap-x-5 text-xs sm:text-sm text-surface-variant/90 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              Guest checkout
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              Paystack-secured payment
            </span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              WhatsApp support
            </span>
          </div>
        </div>
      </section>

      {/* SEARCH & QUICK ACCESS CARD (-mt-8 to overlap hero, verbatim from Stitch) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-20">
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-variant/40 shadow-xl">
          {/* Search Input */}
          <form method="GET" action="/games" className="relative flex items-center">
            <span className="material-symbols-outlined text-outline absolute left-4 pointer-events-none text-[22px]">
              search
            </span>
            <input
              name="q"
              placeholder="Search games (e.g. Free Fire, COD, eFootball...)"
              className="w-full h-12 sm:h-13 pl-12 pr-4 bg-surface rounded-xl border border-surface-variant text-on-surface placeholder:text-outline text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
            />
          </form>

          {/* Quick Filter Chips verbatim from Stitch */}
          <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 sm:justify-center sm:flex-wrap">
            <Link
              href="/games/free-fire"
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-primary-container/30 text-on-surface text-xs font-bold active:scale-95 transition-transform hover:border-primary-container"
            >
              <span>🔥</span>
              <span>Free Fire</span>
            </Link>
            <Link
              href="/games/call-of-duty-mobile"
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-surface-variant text-on-surface-variant text-xs font-bold active:scale-95 transition-transform hover:border-primary-container hover:text-on-surface"
            >
              <span>🎯</span>
              <span>COD: Mobile</span>
            </Link>
            <Link
              href="/games/efootball"
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-surface-variant text-on-surface-variant text-xs font-bold active:scale-95 transition-transform hover:border-primary-container hover:text-on-surface"
            >
              <span>⚽</span>
              <span>eFootball</span>
            </Link>
            <Link
              href="/games/blood-strike"
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-surface-variant text-on-surface-variant text-xs font-bold active:scale-95 transition-transform hover:border-primary-container hover:text-on-surface"
            >
              <span>⚡</span>
              <span>Blood Strike</span>
            </Link>
            <Link
              href="/games"
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-surface-variant text-on-surface-variant text-xs font-bold active:scale-95 transition-transform hover:border-primary-container hover:text-on-surface"
            >
              <span>🎮</span>
              <span>All Games</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED GAMES SECTION: Responsive 3-col Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16" id="games">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
              Featured games
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Top up in seconds with direct in-game player ID credit.
            </p>
          </div>
          <Link
            href="/games"
            className="text-xs sm:text-sm text-primary hover:text-tertiary transition-colors flex items-center group font-bold"
          >
            <span>View all ({games.length})</span>
            <span className="material-symbols-outlined text-sm ml-0.5 group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {games.map(({ game, from }) => (
            <GameCardV2 key={game.id} game={game} from={from} />
          ))}
        </div>
      </section>

      {/* ALREADY ORDERED QUICK TRACKER BANNER (verbatim from Stitch 7d9305c45e964820bc9e4d3684602fb5.html) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-primary-container/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">search_check</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-sm sm:text-base">Already ordered?</h3>
              <p className="text-xs text-on-surface-variant">Check real-time delivery status using your order code</p>
            </div>
          </div>
          <Link
            href="/track-order"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container-lowest border border-surface-variant hover:border-primary text-xs font-bold text-on-surface transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Track order</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* HOW ZENALOAD WORKS: 3 Simple Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20" id="how-it-works">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            How Zenaload works
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-on-surface-variant">
            Get back into the battle in three simple steps; no registration required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-1 flex flex-col">
            <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm mb-4">
              1
            </span>
            <h3 className="text-base font-bold text-on-surface">Choose &amp; enter your ID</h3>
            <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
              Select your game, pick the SKU package you desire, and enter your exact Player ID/UID.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-1 flex flex-col">
            <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm mb-4">
              2
            </span>
            <h3 className="text-base font-bold text-on-surface">Pay securely</h3>
            <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
              Pay in exact Naira via Paystack with Nigerian debit card, instant bank transfer, or USSD.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-1 flex flex-col">
            <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm mb-4">
              3
            </span>
            <h3 className="text-base font-bold text-on-surface">Get credit in-game</h3>
            <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
              Direct automated delivery directly into your game profile in ~24 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* WHY NIGERIAN GAMERS TRUST US (verbatim from Stitch 7d9305c45e964820bc9e4d3684602fb5.html) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20" id="trust">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Why Nigerian gamers trust us
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-on-surface-variant">
            Built by gamers for gamers; designed for speed, value, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-1 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">Paystack-secured payments</h3>
              <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                Bank-grade 256-bit encryption. Zero card details are ever stored on Zenaload servers.
              </p>
            </div>
            <span className="mt-4 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% Encrypted
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-1 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary-container/15 flex items-center justify-center text-secondary mb-4">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">Automated instant delivery</h3>
              <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                Direct publisher API connections guarantee ~24 second fulfillment with zero manual lag.
              </p>
            </div>
            <span className="mt-4 text-[11px] font-bold text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span> Official APIs
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant card-elevation-1 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <h3 className="text-base font-bold text-on-surface">Human support on WhatsApp</h3>
              <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                Real local customer gamers ready to assist 24/7. Zero automated bots that loop endlessly.
              </p>
            </div>
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Chat now</span> &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* CAN'T FIND YOUR GAME BANNER (verbatim from Stitch 8db6da78e3654233bd4a1fab4275d951.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="bg-on-background rounded-3xl p-6 sm:p-10 text-surface-container-lowest flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest/20 text-secondary-fixed text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              Request Game Integration
            </span>
            <h3 className="text-2xl font-extrabold text-surface-container-lowest">Can&apos;t find your game?</h3>
            <p className="text-xs sm:text-sm text-outline-variant max-w-xl">
              Looking for a game not listed here? Tell us on WhatsApp and we will add publisher distribution for you.
            </p>
          </div>
          <a
            href={`https://wa.me/${config.whatsapp}?text=Hello+Zenaload+Support,+I+would+like+to+request+a+new+game+top-up:`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Request Game on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
