import Link from "next/link";
import { config } from "@/config";

export type Section = [string, string[]];

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Section[];
}) {
  const L = config.legal;

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Header banner */}
      <div className="rounded-3xl border border-white/10 bg-card/75 p-6 sm:p-10 backdrop-blur-xl shadow-xl space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-bg2 px-3 py-1 text-xs font-semibold text-mute">
          Legal & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-xs text-mute font-mono">
          Effective Date: {L.effectiveDate} · {L.companyName} (RC {L.rcNumber})
        </p>

        {L.isDraft && (
          <div
            role="note"
            className="my-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 space-y-1"
          >
            <strong className="block font-bold">⚠️ DRAFT TEMPLATE NOTICE</strong>
            <p className="leading-relaxed">
              This document is a placeholder draft. Replace placeholders in <code>src/config/index.ts</code> and ensure a qualified Nigerian legal professional reviews before production deployment.
            </p>
          </div>
        )}

        <p className="pt-2 text-sm text-ink2 leading-relaxed border-t border-white/5">
          {intro}
        </p>
      </div>

      {/* Sections breakdown */}
      <div className="space-y-6">
        {sections.map(([heading, paragraphs], idx) => (
          <section
            key={heading}
            className="rounded-3xl border border-white/10 bg-card/60 p-6 sm:p-8 backdrop-blur-xl space-y-3 shadow-lg"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/20 text-xs font-bold text-hi">
                {idx + 1}
              </span>
              <span>{heading}</span>
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-ink2 leading-relaxed">
              {paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer cross-navigation links */}
      <nav
        aria-label="Legal navigation"
        className="rounded-2xl border border-white/10 bg-bg2/80 p-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-semibold"
      >
        <span className="text-mute uppercase tracking-wider">Related Documents:</span>
        <div className="flex flex-wrap gap-4 text-hi">
          <Link href="/terms" className="hover:text-white transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/refund-policy" className="hover:text-white transition">
            Refund Policy
          </Link>
          <Link href="/support" className="hover:text-white transition">
            Contact Support
          </Link>
        </div>
      </nav>
    </article>
  );
}
