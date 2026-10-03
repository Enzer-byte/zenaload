import { FAQ } from "@/data/content";
export const metadata = { title: "FAQ", description: "Answers about top-up speed, payments, Player IDs and refunds." };
export default function Faq() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} /><h1 className="mb-6 text-3xl font-semibold">FAQ</h1><div className="max-w-2xl space-y-3">{FAQ.map(([q, a]) => <details key={q} className="rounded-xl border border-line bg-card p-4"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-2 text-ink2">{a}</p></details>)}</div></>);
}
