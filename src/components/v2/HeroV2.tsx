import Link from "next/link";

interface HeroV2Props {
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
  preview?: boolean;
}

const hudBadges = [
  { icon: "⚡", label: "Instant In-Game Delivery", subtext: "Automated API route" },
  { icon: "🇳🇬", label: "Pay in Naira (Paystack)", subtext: "Zero FX conversion fees" },
  { icon: "🎮", label: "100% Official Reseller API", subtext: "Safe & authorized top-ups" },
];

const quickGames = [
  { name: "Free Fire", slug: "free-fire", icon: "🔥", badge: "Diamonds" },
  { name: "Call of Duty Mobile", slug: "call-of-duty-mobile", icon: "🎯", badge: "CP Points" },
  { name: "eFootball", slug: "efootball", icon: "⚽", badge: "Coins" },
  { name: "Blood Strike", slug: "blood-strike", icon: "🩸", badge: "Gold" },
];

export function HeroV2({ onSelectCategory, activeCategory, preview }: HeroV2Props) {
  const gamesPath = preview ? "/preview/games" : "/games";

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      {/* Background illumination effect */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-96 w-[700px] rounded-full bg-gradient-to-tr from-brand/20 via-brand2/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Release / Mode Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-card/60 px-3.5 py-1 text-xs font-medium text-hi backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>Nigeria&apos;s Next-Gen Gaming Top-Up Platform</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Level Up Your Game Credits{" "}
          <span className="block bg-gradient-to-r from-hi via-brand to-brand2 bg-clip-text text-transparent">
            in Seconds.
          </span>
        </h1>

        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-sm leading-relaxed text-ink2 sm:text-base md:text-lg">
          No account creation required. Enter your Player ID, pay instantly in Naira, and receive your game credits directly in your game account.
        </p>

        {/* Live Gamer HUD Pills (Responsive grid: 1 col on mobile, 3 cols on tablet/desktop) */}
        <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3 max-w-3xl mx-auto">
          {hudBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 rounded-xl border border-line bg-card/75 p-3 text-left backdrop-blur-md transition-colors hover:border-brand/40"
            >
              <span className="text-2xl leading-none shrink-0">{badge.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{badge.label}</p>
                <p className="text-[11px] text-mute truncate">{badge.subtext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Game Filter / Navigation Chips */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute">
            Popular Titles
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {quickGames.map((game) => (
              <Link
                key={game.slug}
                href={`${gamesPath}/${game.slug}`}
                className="group flex items-center gap-2 rounded-xl border border-line bg-card/80 px-3.5 py-2 text-xs font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-hi hover:bg-elevated hover:shadow-md hover:shadow-brand/20 active:translate-y-0"
              >
                <span className="text-base transition-transform group-hover:scale-110">{game.icon}</span>
                <span className="font-semibold text-white">{game.name}</span>
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-hi">
                  {game.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
