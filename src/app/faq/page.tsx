import { config } from "@/config";
import { FAQ } from "@/data/content";

export const metadata = {
  title: `Frequently Asked Questions — ${config.brand}`,
  description: "Clear answers about top-up speed, Naira payments, Player IDs, and guarantees.",
};

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Header section */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-hi">
          Help & Guidance
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-mute max-w-md mx-auto">
          Everything you need to know about purchasing game credits in Naira on Zenaload.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {FAQ.map(([question, answer]) => (
          <details
            key={question}
            className="group rounded-2xl border border-white/10 bg-card/70 p-5 sm:p-6 backdrop-blur-xl transition-all hover:border-brand/40 shadow-lg"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-base font-bold text-white transition hover:text-hi">
              <span className="pr-4">{question}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-bg2 text-xs text-ink2 transition-transform duration-200 group-open:rotate-180">
                ↓
              </span>
            </summary>
            <div className="mt-4 pt-3 border-t border-white/5 text-xs sm:text-sm text-ink2 leading-relaxed">
              {answer}
            </div>
          </details>
        ))}
      </div>

      {/* Support Desk Action Card */}
      <div className="rounded-3xl border border-white/10 bg-card/60 p-8 text-center backdrop-blur-xl space-y-4">
        <h3 className="text-xl font-bold text-white">Still have questions?</h3>
        <p className="text-xs sm:text-sm text-mute max-w-md mx-auto">
          Our Nigerian support desk is available on WhatsApp and email to assist you with any questions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${config.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/25 active:scale-95"
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
          <a
            href={`mailto:${config.supportEmail}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-bg2 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:border-brand/40 transition"
          >
            <span>✉️ Email Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
