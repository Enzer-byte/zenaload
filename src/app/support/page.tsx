import Link from "next/link";
import { config } from "@/config";
import { SupportForm } from "@/components/SupportForm";

export const metadata = {
  title: `Customer Support — ${config.brand}`,
  description: "Get prompt assistance for your game credit top-ups in Nigeria.",
};

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header section */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-hi">
          24/7 Gamer Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          We&apos;re Here to Help
        </h1>
        <p className="text-sm text-mute max-w-md mx-auto">
          Need help with an order, UID question, or payment receipt? Reach out to our Nigerian desk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Fast Track: WhatsApp Desk */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Fastest Response Time (~5 mins)
            </span>
            <h2 className="text-2xl font-bold text-white">
              WhatsApp Instant Desk
            </h2>
            <p className="text-xs sm:text-sm text-ink2 leading-relaxed">
              For real-time assistance with live orders, screenshot verification of Player IDs, or instant payment confirmations.
            </p>

            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition active:scale-95"
            >
              <span>💬 Message on WhatsApp</span>
              <span>&rarr;</span>
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Direct Email Inquiries</h3>
            <p className="text-xs text-mute">
              For official correspondence, partnerships, or business queries:
            </p>
            <a
              href={`mailto:${config.supportEmail}`}
              className="text-sm font-semibold text-hi hover:underline block"
            >
              ✉️ {config.supportEmail}
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Order Self-Service</h3>
            <p className="text-xs text-mute">
              Check delivery milestones or get your digital receipt anytime:
            </p>
            <Link
              href="/track-order"
              className="text-xs font-semibold text-hi hover:underline block"
            >
              🔍 Open Live Order Tracker &rarr;
            </Link>
          </div>
        </div>

        {/* Ticket Form */}
        <div>
          <SupportForm />
        </div>
      </div>
    </div>
  );
}
