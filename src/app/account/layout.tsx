import Link from "next/link";
import type { ReactNode } from "react";
export const metadata = { title: "Account" };
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (<><h1 className="mb-1 text-3xl font-semibold">Your account</h1><p className="mb-5 text-sm text-mute">No sign-in needed. These pages use data saved on this device. Cross-device accounts are coming later.</p><div className="grid gap-6 md:grid-cols-[170px_1fr]"><aside className="flex gap-2 overflow-x-auto text-ink2 md:flex-col">{[["/account", "Overview"], ["/account/orders", "Orders"], ["/account/player-ids", "Saved Player IDs"], ["/account/loyalty", "Rewards"], ["/account/referrals", "Referrals"]].map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap rounded-lg px-3 py-2 hover:bg-elevated">{l}</Link>)}</aside><div>{children}</div></div></>);
}
