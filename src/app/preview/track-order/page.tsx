"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { config } from "@/config";
import { useLocal } from "@/lib/useLocal";

export default function PreviewTrackOrderPage() {
  const [activeTab, setActiveTab] = useState<"ref" | "id">("ref");
  const [orderRef, setOrderRef] = useState("ZL-20261005-A1B2C3D4");
  const [phoneOrUid, setPhoneOrUid] = useState("");
  const router = useRouter();
  const [recentOrders, setRecentOrders, ready] = useLocal<string[]>("zl_orders", []);

  function handleTrackRef(e: React.FormEvent) {
    e.preventDefault();
    if (orderRef.trim()) {
      router.push(`/preview/orders/${orderRef.trim().toUpperCase()}`);
    }
  }

  function handleTrackId(e: React.FormEvent) {
    e.preventDefault();
    if (phoneOrUid.trim()) {
      router.push(`/preview/track-order?search=${encodeURIComponent(phoneOrUid.trim())}`);
    }
  }

  function pasteClipboard() {
    navigator.clipboard?.readText().then((text) => {
      if (text) setOrderRef(text.trim());
    });
  }

  function fillSample(ref: string) {
    setOrderRef(ref);
    setActiveTab("ref");
  }

  function clearHistory() {
    setRecentOrders([]);
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 pb-28 md:pb-16 font-stitch">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-xs sm:text-sm text-outline">
        <Link href="/preview" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">sports_esports</span>
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Track Order</span>
      </nav>

      {/* Hero Header & Trust Strips verbatim from Stitch 806cd414f8494691b9e09aa778973d91.html */}
      <section className="text-center md:text-left mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/15 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-[14px]">bolt</span> Real-time Order Engine
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface mb-3 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Check real-time delivery status, retrieve receipt, or confirm automated in-game diamond & currency injection.
        </p>

        {/* Trust Badges & Uptime Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-4 mt-6">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-surface-variant shadow-sm text-on-surface text-xs sm:text-sm font-semibold">
            <span className="material-symbols-outlined text-primary-container text-[18px]">bolt</span>
            <span>Automated ~24s delivery</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-surface-variant shadow-sm text-on-surface text-xs sm:text-sm font-semibold">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
            <span>Paystack Verified</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-surface-variant shadow-sm text-on-surface text-xs sm:text-sm font-semibold">
            <span className="material-symbols-outlined text-tertiary-container text-[18px]">chat</span>
            <span>24/7 WhatsApp Assistance</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Section: Primary Lookup + Pipeline Status Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Primary Lookup Card (Left 8 Cols Desktop) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-surface-variant shadow-[0px_4px_16px_rgba(10,18,54,0.04)]">
          {/* Tab Selector: Dual Search Mode */}
          <div className="flex items-center gap-2 p-1.5 bg-surface-container rounded-xl mb-6 max-w-md">
            <button
              type="button"
              onClick={() => setActiveTab("ref")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "ref"
                  ? "text-on-surface bg-surface-container-lowest shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              By Order Reference
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("id")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "id"
                  ? "text-on-surface bg-surface-container-lowest shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
              By Phone / Player ID
            </button>
          </div>

          {/* Form 1: By Order Reference */}
          {activeTab === "ref" && (
            <form onSubmit={handleTrackRef} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-on-surface mb-2" htmlFor="order-ref-input">
                  Zenaload Order Reference <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">tag</span>
                  <input
                    id="order-ref-input"
                    type="text"
                    required
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                    placeholder="e.g. ZL-20261005-A1B2C3D4"
                    className="w-full h-[52px] pl-11 pr-24 rounded-xl border-[1.5px] border-surface-variant/80 text-on-surface font-mono text-sm sm:text-base placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/15 transition-all uppercase"
                  />
                  <button
                    type="button"
                    onClick={pasteClipboard}
                    className="absolute right-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_paste</span> Paste
                  </button>
                </div>
                <p className="mt-2 text-xs text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
                  Found on your Paystack payment receipt, SMS notification, and WhatsApp alert.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="primary-gradient-cta w-full sm:w-auto px-8 h-[52px] rounded-xl text-surface-container-lowest text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform brand-glow"
                >
                  <span>Track Order</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </form>
          )}

          {/* Form 2: By Phone or Player ID */}
          {activeTab === "id" && (
            <form onSubmit={handleTrackId} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-on-surface mb-2" htmlFor="player-id-input">
                  Nigerian Phone (+234) or In-Game UID <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">sports_esports</span>
                  <input
                    id="player-id-input"
                    type="text"
                    required
                    value={phoneOrUid}
                    onChange={(e) => setPhoneOrUid(e.target.value)}
                    placeholder="080... or Player UID (Free Fire, COD, etc.)"
                    className="w-full h-[52px] pl-11 pr-4 rounded-xl border-[1.5px] border-surface-variant/80 text-on-surface text-sm sm:text-base placeholder:text-outline/70 focus:outline-none focus:border-primary-container focus:ring-4 focus:ring-primary-container/15 transition-all"
                  />
                </div>
                <p className="mt-2 text-xs text-outline">
                  Lookup orders completed or processing within the last 72 hours.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="primary-gradient-cta w-full sm:w-auto px-8 h-[52px] rounded-xl text-surface-container-lowest text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform brand-glow"
                >
                  <span>Search Recent Orders</span>
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
              </div>
            </form>
          )}

          {/* Interactive Quick-Test Reference Chips verbatim from Stitch */}
          <div className="mt-8 pt-6 border-t border-surface-variant">
            <p className="text-xs uppercase tracking-wider text-outline font-bold mb-3">Try Live Sample References:</p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => fillSample("ZL-20261005-A1B2C3D4")}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-variant/60 border border-surface-variant text-left transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">ZL-20261005-A1B2C3D4</div>
                  <div className="text-[11px] text-on-surface-variant">Free Fire 520💎 • Delivering</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillSample("ZL-20261004-9X8Y7Z")}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-variant/60 border border-surface-variant text-left transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">ZL-20261004-9X8Y7Z</div>
                  <div className="text-[11px] text-on-surface-variant">COD Mobile • Delivered ✓</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Live Delivery Pipeline Status Widget (Right 4 Cols Desktop verbatim from Stitch) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-on-background via-[#0A1236] to-[#151D4A] text-surface-container-lowest rounded-2xl p-6 md:p-7 flex flex-col justify-between shadow-[0px_12px_32px_rgba(10,18,54,0.12)] border border-surface-variant/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">network_check</span>
                API Cluster: Lagos (LOS-1)
              </span>
              <span className="text-secondary-fixed-dim text-xs font-bold">100% Operational</span>
            </div>
            <h3 className="text-lg font-extrabold text-surface-container-lowest mb-2">Automated In-Game Pipeline</h3>
            <p className="text-xs sm:text-sm text-outline-variant mb-6 leading-relaxed">
              Zero-wait top-ups. Our automated injector fulfills directly into publishers&apos; servers in under 30 seconds.
            </p>

            {/* Status Metrics */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-surface-container-lowest/5 border border-surface-variant/10 flex items-center justify-between">
                <span className="text-xs text-outline-variant">Avg Delivery Today</span>
                <span className="text-sm font-bold text-secondary-container">19.4 seconds</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest/5 border border-surface-variant/10 flex items-center justify-between">
                <span className="text-xs text-outline-variant">Gateway Settlement</span>
                <span className="text-sm font-bold text-surface-container-lowest">Paystack Instant</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest/5 border border-surface-variant/10 flex items-center justify-between">
                <span className="text-xs text-outline-variant">Supported Games</span>
                <span className="text-sm font-bold text-surface-container-lowest">Free Fire, CODM, eFootball</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-variant/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <div className="text-xs text-outline-variant">
              Need urgent manual review?{" "}
              <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer" className="text-secondary-container font-bold hover:underline">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Recent Orders on This Browser (Guest LocalStorage preview) */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">history</span>
              Recent Orders on This Device
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">Cached locally for guest convenience. No password or login required.</p>
          </div>
          {ready && recentOrders.length > 0 && (
            <button
              onClick={clearHistory}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-outline hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              Clear history
            </button>
          )}
        </div>

        {ready && recentOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentOrders.map((id) => (
              <div
                key={id}
                className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container font-bold border border-surface-variant">
                      <span className="material-symbols-outlined text-[26px]">sports_esports</span>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface">Zenaload Order</h3>
                      <span className="text-xs text-outline font-mono">Ref: {id}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-on-secondary-container text-xs font-bold border border-secondary-container/30">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    Track Live
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-variant">
                  <span className="text-xs text-outline">Stored on this browser</span>
                  <Link
                    href={`/preview/orders/${id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-tertiary transition-colors"
                  >
                    <span>View Status</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sample Order 1 verbatim from Stitch */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container via-primary-container to-tertiary-container animate-pulse"></div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container font-bold border border-surface-variant">
                    <span className="material-symbols-outlined text-[26px]">local_fire_department</span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-on-surface">Garena Free Fire</h3>
                    <span className="text-xs text-outline">UID: <span className="font-bold text-on-surface">293****924</span> (Nigeria)</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-on-secondary-container text-xs font-bold border border-secondary-container/30">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                  Delivering (~14s left)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-surface-variant text-xs">
                <div>
                  <span className="text-outline block text-[11px]">Package</span>
                  <span className="font-bold text-on-surface">520 Diamonds</span>
                </div>
                <div>
                  <span className="text-outline block text-[11px]">Amount Paid</span>
                  <span className="font-bold text-on-surface">₦5,800</span>
                </div>
                <div>
                  <span className="text-outline block text-[11px]">Time</span>
                  <span className="font-bold text-on-surface">Today 05:42 AM</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-outline">Ref: ZL-20261005-A1B2C3D4</span>
                <Link
                  href="/preview/orders/ZL-20261005-A1B2C3D4"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-tertiary transition-colors"
                >
                  <span>View Live Status</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Sample Order 2 verbatim from Stitch */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface font-bold border border-surface-variant">
                    <span className="material-symbols-outlined text-[26px]">military_tech</span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-on-surface">Call of Duty: Mobile</h3>
                    <span className="text-xs text-outline">UID: <span className="font-bold text-on-surface">682****110</span> (Global)</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-bold border border-primary/20">
                  <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                  Delivered ✓
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-surface-variant text-xs">
                <div>
                  <span className="text-outline block text-[11px]">Package</span>
                  <span className="font-bold text-on-surface">420 CP Points</span>
                </div>
                <div>
                  <span className="text-outline block text-[11px]">Amount Paid</span>
                  <span className="font-bold text-on-surface">₦1,200</span>
                </div>
                <div>
                  <span className="text-outline block text-[11px]">Time</span>
                  <span className="font-bold text-on-surface">Yesterday</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-outline">Ref: ZL-20261004-9X8Y7Z</span>
                <Link
                  href="/preview/orders/ZL-20261004-9X8Y7Z"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-tertiary transition-colors"
                >
                  <span>View Receipt</span>
                  <span className="material-symbols-outlined text-[16px]">receipt</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section: Can't Find Your Order? Self-Help & WhatsApp Support verbatim from Stitch */}
      <section className="mb-14" id="support-grid">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface">Can&apos;t Find Your Order?</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">Follow these quick diagnostic steps or speak directly with our Lagos resolution team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-[26px]">sms</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Check WhatsApp or SMS</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                We send automated delivery notifications and your unique ZL tracking reference to the Nigerian phone number entered during checkout.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">Bank Debited but No Ref?</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                If your Nigerian bank account or OPay was debited but the screen closed, our Paystack automated webhook still processes your order automatically.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-[26px]">support_agent</span>
              </div>
              <h3 className="text-base font-bold text-on-surface mb-2">24/7 Human Resolution</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                Send your Paystack transaction reference to our Lagos desk for immediate priority top-up push.
              </p>
            </div>
            <a
              href={`https://wa.me/${config.whatsapp}?text=Hello%20Zenaload%20Support%2C%20I%20need%20help%20tracking%20my%20order`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-surface-container-lowest transition-all flex items-center justify-center gap-2"
            >
              <span>Chat on WhatsApp</span>
              <span className="material-symbols-outlined text-[16px]">chat</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
