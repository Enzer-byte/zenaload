import Link from "next/link";
import { config } from "@/config";

export const metadata = {
  title: `Stitch Design Comparison Index — ${config.brand}`,
  description: "Comparison index showing all Google Stitch preview screens alongside existing live screens.",
};

const screens = [
  {
    name: "Home Screen",
    previewUrl: "/preview",
    liveUrl: "/",
    stitchId: "acccf5be2e5d4f378fc0535d4b659307",
    status: "Adapted with Live Data",
    description: "Hero with search input, Bento featured top-ups, trust pillars, and FAQ accordions.",
  },
  {
    name: "Games Catalogue",
    previewUrl: "/preview/games",
    liveUrl: "/games",
    stitchId: "8db6da78e3654233bd4a1fab4275d951",
    status: "Adapted with Live Data",
    description: "Categorized games list, real-time query search, and starting price labels.",
  },
  {
    name: "Game Top-Up (e.g. Free Fire)",
    previewUrl: "/preview/games/free-fire",
    liveUrl: "/games/free-fire",
    stitchId: "93011b09c91a4cffaa7f7bce3c9c645d",
    status: "Adapted with Live Data",
    description: "Denomination tiles with active glow, Player ID validation, and mobile sticky checkout bar.",
  },
  {
    name: "Direct Guest Checkout",
    previewUrl: "/preview/checkout",
    liveUrl: "/checkout",
    stitchId: "74eb73d961c941c5ad96ef66675b704a",
    status: "Adapted with Live Data",
    description: "100% guest flow, Nigerian payment options selector, order breakdown summary.",
  },
  {
    name: "Live Order Tracking",
    previewUrl: "/preview/orders/ZL-20261005-DEMO1234",
    liveUrl: "/orders/ZL-20261005-DEMO1234",
    stitchId: "c78dd039a4f64c3281ea7c8e04a7fdff",
    status: "Adapted with Live Data",
    description: "Automated fulfillment progress stepper, delivery time metrics, and transaction receipt.",
  },
  {
    name: "Track Order Portal",
    previewUrl: "/preview/track-order",
    liveUrl: "/track-order",
    stitchId: "806cd414f8494691b9e09aa778973d91",
    status: "Adapted with Live Data",
    description: "Search by Order Reference or phone number, quick links to cached device orders.",
  },
  {
    name: "Support & FAQ",
    previewUrl: "/preview/support",
    liveUrl: "/support",
    stitchId: "0a06521336e64f478187f73f635e1388",
    status: "Adapted with Live Data",
    description: "Dedicated WhatsApp instant desk, support ticket submission, and categorized FAQ.",
  },
  {
    name: "How It Works & Policy Hub",
    previewUrl: "/preview/how-it-works",
    liveUrl: "/how-it-works",
    stitchId: "2b3f56b114e74ad3a1d6f88638a8d277",
    status: "Adapted with Live Data",
    description: "4-step frictionless top-up walkthrough, legal policies overview, and refund rules.",
  },
  {
    name: "Device Account Hub",
    previewUrl: "/preview/account",
    liveUrl: "/account",
    stitchId: "9cb16036e9174b16a36fa85c9044614e",
    status: "Adapted with Live Data",
    description: "Saved orders, saved in-game Player IDs for 1-tap reorders, loyalty preview.",
  },
];

export default function PreviewIndexPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-semibold text-hi">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Google Stitch Design Preview · Live Site Untouched</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Stitch Design System & Screen Comparison
        </h1>
        <p className="text-sm sm:text-base text-mute max-w-2xl">
          Below is every screen from the <strong className="text-white">Zenaload Game Top-Up App</strong> Stitch project, adapted to the live Supabase catalog and order state machine. Compare each preview alongside the live version.
        </p>
      </div>

      {/* Comparison Table / Grid */}
      <div className="space-y-4">
        {screens.map((s, idx) => (
          <div
            key={s.stitchId}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-3xl border border-white/10 bg-card/75 p-6 backdrop-blur-xl hover:border-brand/40 transition"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand/20 font-mono text-xs font-bold text-hi">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-bold text-white">{s.name}</h3>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  {s.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">{s.description}</p>
              <div className="font-mono text-[11px] text-mute pt-1">
                Stitch Screen ID: <span className="text-white/60">{s.stitchId}</span>
              </div>
            </div>

            {/* Side-by-side action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={s.previewUrl}
                className="stitch-brand-gradient stitch-brand-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                <span>View Stitch Preview</span>
                <span>&rarr;</span>
              </Link>
              <Link
                href={s.liveUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-elevated px-4 py-2.5 text-xs sm:text-sm font-semibold text-ink2 hover:text-white hover:border-white/20 transition"
              >
                <span>Compare Live ↗</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
