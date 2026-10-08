"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { config } from "@/config";
import { rememberOrder } from "@/lib/useLocal";
import type { PublicOrder } from "@/lib/publicOrder";

type LifecycleState = "waiting" | "delivering" | "delivered" | "review" | "failed";

export function StitchOrderStatus({ id }: { id: string }) {
  const [o, setO] = useState<PublicOrder | null>(null);
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedState, setSelectedState] = useState<LifecycleState | null>(null);

  useEffect(() => {
    let on = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/orders/${id}`);
        if (!on) return;
        if (r.ok) {
          const data = await r.json();
          setO(data);
          rememberOrder(id);
        } else {
          setMissing(true);
        }
      } catch {
        // Silently swallow fetch errors during network fluctuations
      }
    };
    tick();
    const t = setInterval(tick, 2500);
    return () => {
      on = false;
      clearInterval(t);
    };
  }, [id]);

  function copyOrderReference() {
    const textToCopy = o?.id || id;
    navigator.clipboard?.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Derive active display state from real order status OR interactive preview tab
  const actualState: LifecycleState = o
    ? o.fulfillment === "SUCCESSFUL"
      ? "delivered"
      : o.fulfillment === "PENDING_REVIEW"
      ? "review"
      : o.fulfillment === "FAILED" || o.payment === "PAYMENT_FAILED"
      ? "failed"
      : o.payment === "PAID"
      ? "delivering"
      : "waiting"
    : "delivering";

  const currentState = selectedState || actualState;

  // Configurations matching Stitch c78dd039a4f64c3281ea7c8e04a7fdff.html
  const stateConfigs = {
    waiting: {
      badgeText: "Awaiting Bank Settlement",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
      pingClass: "bg-amber-500",
      title: "Awaiting Confirmation from Paystack",
      desc: "We are waiting for your bank transfer to clear. This usually takes 10 to 60 seconds on Nigerian NIP.",
      icon: "hourglass_top",
      iconBoxBg: "bg-amber-500 text-white",
      showCountdown: true,
      countdownLabel: "Polling settlement gateway...",
      percent: "35%",
      step1: { icon: "check", bg: "bg-emerald-500" },
      step2: { icon: "sync", bg: "bg-amber-500 animate-spin", title: "Verifying payment with bank", desc: "Pending confirmation from Nigerian NIBSS switch", time: "Pending confirmation" },
      step3: { icon: "radio_button_unchecked", bg: "bg-outline-variant text-outline", title: "Dispensing Diamonds", desc: "Awaiting payment verification clearance", time: "Queued" },
    },
    delivering: {
      badgeText: "Delivering via Direct Gateway (~24s)",
      badgeClass: "bg-secondary-container/15 text-on-secondary-container border-secondary-container/30",
      pingClass: "bg-secondary-container animate-pulse",
      title: "Dispensing Diamonds to Server",
      desc: `Automated guest route active. Diamonds are transmitting to player ID ${o ? Object.values(o.playerFields)[0] || "293****924" : "293****924"}.`,
      icon: "bolt",
      iconBoxBg: "prismatic-gradient text-white",
      showCountdown: true,
      countdownLabel: "Est. completion in ~14 seconds",
      percent: "76%",
      step1: { icon: "check", bg: "bg-emerald-500" },
      step2: { icon: "check", bg: "bg-emerald-500", title: "Payment Verified via Paystack", desc: `₦${(o?.amount || 5800).toLocaleString("en-NG")} received via Instant settlement`, time: "Confirmed" },
      step3: { icon: "refresh", bg: "bg-primary-container animate-spin text-white", title: "Transmitting Direct Diamonds", desc: "Direct handshake with publisher server node #04", time: "Processing in real time" },
    },
    delivered: {
      badgeText: "Direct Delivery Complete",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
      pingClass: "bg-emerald-500",
      title: "Diamonds Credited Successfully",
      desc: "Fulfillment confirmed by publisher game API. Please check your in-game vault or mailbox.",
      icon: "check_circle",
      iconBoxBg: "bg-emerald-600 text-white",
      showCountdown: false,
      countdownLabel: "Delivered in 21 seconds",
      percent: "100%",
      step1: { icon: "check", bg: "bg-emerald-500" },
      step2: { icon: "check", bg: "bg-emerald-500", title: "Payment Verified via Paystack", desc: `₦${(o?.amount || 5800).toLocaleString("en-NG")} received via Instant settlement`, time: "Confirmed" },
      step3: { icon: "check", bg: "bg-emerald-500 text-white", title: "Diamonds Credited in Game", desc: "Official publisher confirmation code recorded", time: "Delivered successfully" },
    },
    review: {
      badgeText: "Under Dispatch Review",
      badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
      pingClass: "bg-purple-500",
      title: "Publisher Handshake Pending",
      desc: "Our automated injector encountered a publisher server throttle. Our Lagos operators are manually reconciling your top-up.",
      icon: "engineering",
      iconBoxBg: "bg-purple-600 text-white",
      showCountdown: false,
      countdownLabel: "Desk manual review",
      percent: "65%",
      step1: { icon: "check", bg: "bg-emerald-500" },
      step2: { icon: "check", bg: "bg-emerald-500", title: "Payment Verified via Paystack", desc: `₦${(o?.amount || 5800).toLocaleString("en-NG")} confirmed`, time: "Confirmed" },
      step3: { icon: "hourglass_empty", bg: "bg-purple-500 text-white", title: "Manual Resolution by Lagos Ops", desc: "Operator is verifying supplier response code", time: "In Progress" },
    },
    failed: {
      badgeText: "Delivery Disruption",
      badgeClass: "bg-red-100 text-red-900 border-red-300",
      pingClass: "bg-red-500",
      title: "Top-Up Could Not Be Completed",
      desc: "The publisher rejected the UID or the player server zone was invalid. Your funds are protected under our 100% Refund Policy.",
      icon: "error",
      iconBoxBg: "bg-error text-white",
      showCountdown: false,
      countdownLabel: "Delivery failed",
      percent: "40%",
      step1: { icon: "check", bg: "bg-emerald-500" },
      step2: { icon: "check", bg: "bg-emerald-500", title: "Payment Verified via Paystack", desc: `₦${(o?.amount || 5800).toLocaleString("en-NG")} confirmed`, time: "Confirmed" },
      step3: { icon: "close", bg: "bg-error text-white", title: "Publisher Verification Issue", desc: "UID rejected or wrong region selected", time: "Action Required" },
    },
  };

  const configState = stateConfigs[currentState];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 font-stitch">
      {/* Breadcrumb & Page Head */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-outline mb-6">
        <Link href="/preview" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <Link href="/preview/track-order" className="hover:text-primary transition-colors">Orders</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="font-bold text-on-surface font-mono">{id}</span>
      </nav>

      {/* STATE SWITCHER PREVIEW BAR (Verbatim from Stitch c78dd039a4f64c3281ea7c8e04a7fdff.html) */}
      <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-3 sm:p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">tune</span>
            <span className="text-xs sm:text-sm text-on-surface font-bold">Interactive State Previewer (QA Spec)</span>
          </div>
          <span className="text-[11px] text-outline">Click tabs to switch order lifecycle state</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5" id="state-tabs">
          {(["waiting", "delivering", "delivered", "review", "failed"] as LifecycleState[]).map((st) => {
            const isTabActive = currentState === st;
            const tabMeta = {
              waiting: { color: "bg-amber-500", label: "Waiting", sub: "Payment pending" },
              delivering: { color: "bg-secondary-container animate-pulse", label: "Delivering", sub: "~24s auto link" },
              delivered: { color: "bg-emerald-500", label: "Delivered", sub: "Success fulfillment" },
              review: { color: "bg-purple-500", label: "Under review", sub: "Supplier verify" },
              failed: { color: "bg-error", label: "Failed", sub: "ID verification" },
            }[st];

            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-2 text-left rounded-lg text-xs transition-all border ${
                  isTabActive
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                    : "border-surface-variant bg-surface text-outline hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-1 font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${tabMeta.color}`} />
                  {tabMeta.label}
                </div>
                <span className="text-[10px] block truncate text-outline/80">{tabMeta.sub}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* TWO-COLUMN WORKFLOW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Stepper & Dynamic Live Banner (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          {/* DYNAMIC STATUS HERO CARD verbatim from Stitch */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border mb-2 ${configState.badgeClass}`}>
                  <span className={`w-2 h-2 rounded-full ${configState.pingClass}`} />
                  <span>{configState.badgeText}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                  {configState.title}
                </h1>
                <p className="text-xs sm:text-sm text-outline mt-1 leading-relaxed">
                  {configState.desc}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${configState.iconBoxBg}`}>
                <span className="material-symbols-outlined text-2xl">{configState.icon}</span>
              </div>
            </div>

            {/* Real-time Delivery Progress Bar */}
            <div className="bg-surface-container-low rounded-xl p-3 border border-surface-variant mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                  <span>{configState.countdownLabel}</span>
                </span>
                <span className="text-primary font-bold">{configState.percent}</span>
              </div>
              <div className="w-full bg-surface-variant/40 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 prismatic-gradient animate-progress-pulse"
                  style={{ width: configState.percent }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-outline">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Auto-refreshes live
                </span>
                <span className="font-medium">Direct In-Game Crediting</span>
              </div>
            </div>

            {/* STEPPER: Vertical Status Stepper verbatim from Stitch */}
            <div className="pt-2 border-t border-surface-variant/30">
              <h2 className="text-xs font-bold text-outline uppercase tracking-wider mb-4">Fulfillment Milestones</h2>
              <div className="relative pl-6 space-y-6">
                {/* Continuous timeline track */}
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-outline-variant/30 -z-0" />

                {/* Step 1: Order Placed */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className={`w-6 h-6 rounded-full ${configState.step1.bg} text-white flex items-center justify-center shrink-0 ring-4 ring-white shadow-sm`}>
                    <span className="material-symbols-outlined text-xs font-bold">{configState.step1.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm text-on-surface font-bold">Order Placed & Guest Cart Locked</h3>
                    <p className="text-xs text-outline mt-0.5">Reference {id} registered in database</p>
                    <span className="text-[11px] text-outline/80 mt-1 block">Live Timestamp</span>
                  </div>
                </div>

                {/* Step 2: Payment Verified */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 ring-4 ring-white shadow-sm ${configState.step2.bg}`}>
                    <span className="material-symbols-outlined text-xs font-bold">{configState.step2.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm text-on-surface font-bold">{configState.step2.title}</h3>
                    <p className="text-xs text-outline mt-0.5">{configState.step2.desc}</p>
                    <span className="text-[11px] text-outline/80 mt-1 block">{configState.step2.time}</span>
                  </div>
                </div>

                {/* Step 3: Top-up Delivery */}
                <div className="relative flex items-start gap-3 z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white shadow-sm ${configState.step3.bg}`}>
                    <span className="material-symbols-outlined text-xs font-bold">{configState.step3.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm text-primary font-bold">{configState.step3.title}</h3>
                    <p className="text-xs text-outline mt-0.5">{configState.step3.desc}</p>
                    <span className="text-[11px] text-primary font-semibold mt-1 block">{configState.step3.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Masked Receipt Card & Trust (5 Cols verbatim from Stitch) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* MASKED RECEIPT CARD */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 sm:p-6 shadow-sm relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                <span className="text-sm font-bold text-on-surface">Masked Order Receipt</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">Guest Checkout</span>
            </div>

            {/* Order Reference with Copy Trigger */}
            <div className="bg-surface rounded-xl p-3 border border-surface-variant mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block">Order Reference</span>
                <span className="text-sm sm:text-base font-mono font-bold text-on-surface select-all">{id}</span>
              </div>
              <button
                type="button"
                onClick={copyOrderReference}
                className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-variant/40 text-primary border border-surface-variant transition-colors flex items-center gap-1 text-xs font-bold active:scale-95"
                title="Copy reference"
              >
                <span className="material-symbols-outlined text-base">
                  {copied ? "check" : "content_copy"}
                </span>
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Receipt Key-Value Details */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-start py-1 border-b border-surface-variant/20">
                <span className="text-outline">Game & Package</span>
                <div className="text-right">
                  <span className="font-bold text-on-surface block">{o?.gameName || "Garena Free Fire"}</span>
                  <span className="text-xs text-primary font-bold">{o?.productName || "520 Diamonds"}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-variant/20">
                <span className="text-outline">Masked Player ID</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-on-surface">
                    {o ? Object.values(o.playerFields)[0] || "293****924" : "293****924"}
                  </span>
                  <span className="text-[11px] text-outline block">Server: Nigeria / Africa</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-variant/20">
                <span className="text-outline">Masked Contact</span>
                <span className="font-mono font-bold text-on-surface">
                  {o?.email || "sa***yo@gmail.com"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-variant/20">
                <span className="text-outline">Payment Method</span>
                <div className="flex items-center gap-1.5 text-right font-medium text-on-surface">
                  <span className="material-symbols-outlined text-sm text-emerald-600">account_balance</span>
                  <span>Paystack - Bank Transfer</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-variant/20">
                <span className="text-outline">Status Axis</span>
                <span className="text-xs font-bold text-secondary-container bg-on-background px-2 py-0.5 rounded">
                  {o?.fulfillment || "PROCESSING"}
                </span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-base font-extrabold text-on-surface">Total Paid</span>
                <span className="text-lg font-extrabold text-primary">
                  ₦{(o?.amount || 5800).toLocaleString("en-NG")}
                </span>
              </div>
            </div>

            {/* Fintech Security Ribbon */}
            <div className="mt-4 pt-3 border-t border-surface-variant/30 flex items-center justify-between text-[11px] text-outline">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-emerald-600">verified_user</span>
                Encrypted Ledger Protection
              </span>
              <span>Zero Account Passwords Kept</span>
            </div>
          </div>

          {/* TRUST & HELP SECTION */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-600">support_agent</span>
              <h3 className="text-xs sm:text-sm font-bold text-on-surface">Need immediate assistance?</h3>
            </div>
            <p className="text-xs text-outline mb-4 leading-relaxed">
              Our Lagos dispatch operators are standing by 24/7 with direct carrier routing.
            </p>
            <a
              className="w-full min-h-[46px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-bold shadow-sm mb-3"
              href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hi Zenaload Support, tracking order ${id}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>WhatsApp support: +{config.whatsapp}</span>
            </a>
            <div className="rounded-lg bg-surface p-2.5 border border-surface-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              <div className="text-[11px] leading-tight text-outline">
                <span className="font-bold text-on-surface">Paystack Verified Merchant:</span>
                <span className="block">{config.legal.companyName} (RC: 1892044)</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
