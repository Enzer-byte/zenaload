import Link from "next/link";
import { config } from "@/config";
export type Section = [string, string[]];
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  const L = config.legal;
  return (<article className="max-w-2xl"><h1 className="text-3xl font-semibold">{title}</h1><p className="mt-1 text-sm text-mute">Effective: {L.effectiveDate}</p>
    {L.isDraft && <div role="note" className="my-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">Draft template. Replace every [PLACEHOLDER] in <code>src/config/index.ts</code> and have a Nigerian lawyer review this page before launch.</div>}
    <p className="my-4 text-ink2">{intro}</p>{sections.map(([h, ps], i) => <section key={h} className="mt-6"><h2 className="text-lg font-medium">{i + 1}. {h}</h2>{ps.map((p, j) => <p key={j} className="mt-2 text-ink2">{p}</p>)}</section>)}
    <nav aria-label="Legal pages" className="mt-10 flex flex-wrap gap-4 border-t border-line pt-4 text-sm text-hi"><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/support">Contact support</Link></nav></article>);
}
