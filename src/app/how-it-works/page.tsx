import Link from "next/link";
import { STEPS } from "@/data/content";
export const metadata = { title: "How It Works", description: "Choose a game, enter your Player ID, pay in Naira and track your top-up." };
export default function How() {
  return (<><h1 className="mb-6 text-3xl font-semibold">How It Works</h1><ol className="grid gap-4 md:grid-cols-4">{STEPS.map(([t, d], i) => <li key={t} className="rounded-2xl border border-line bg-card p-5"><div className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-elevated text-hi">{i + 1}</div><h2 className="font-medium">{t}</h2><p className="mt-1 text-sm text-ink2">{d}</p></li>)}</ol><div className="mt-8 flex gap-3"><Link href="/games" className="rounded-xl bg-brand px-5 py-3">Top Up Now</Link><Link href="/track-order" className="rounded-xl border border-line px-5 py-3">Track Order</Link></div></>);
}
