import Link from "next/link";
import { config } from "@/config";
import { STEPS } from "@/data/content";

export const metadata = {
  title: `How It Works — ${config.brand}`,
  description: "Learn how to top up your mobile games in seconds using Naira on Zenaload.",
};

export default function HowItWorksPage() {
  const stepIcons = ["🎮", "🆔", "💳", "⚡"];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Header section */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-hi">
          Fulfillment Process
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          How Zenaload Works
        </h1>
        <p className="text-sm sm:text-base text-mute max-w-xl mx-auto">
          From selecting credits to in-game delivery in under a minute. Zero passwords, zero accounts, zero dollar-card hassles.
        </p>
      </div>

      {/* 4-Step Bento Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STEPS.map(([title, desc], idx) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-8 backdrop-blur-xl transition-all hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand2/20 text-2xl border border-brand/20 shadow-inner">
                {stepIcons[idx] || "🎮"}
              </span>
              <span className="font-mono text-2xl font-black text-white/20 group-hover:text-hi/40 transition-colors">
                0{idx + 1}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-bold text-white group-hover:text-hi transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-ink2 leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Card */}
      <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-r from-brand/15 via-bg2 to-brand2/15 p-8 sm:p-10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              Guaranteed Delivery or 100% Refund
            </h3>
            <p className="text-xs sm:text-sm text-ink2 max-w-lg">
              Because we integrate directly with authorized publisher distribution APIs, your top-up is permanent and ban-free. If an order cannot be delivered, you receive an automated refund.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/games"
              className="rounded-xl bg-gradient-to-r from-brand to-brand2 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:brightness-110 transition active:scale-95"
            >
              Top Up Now &rarr;
            </Link>
            <Link
              href="/faq"
              className="rounded-xl border border-white/10 bg-card px-5 py-3 text-sm font-semibold text-white hover:border-brand/40 transition"
            >
              Read FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
