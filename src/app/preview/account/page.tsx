"use client";

import { useState } from "react";
import Link from "next/link";
import { config } from "@/config";
import { useLocal } from "@/lib/useLocal";

export default function PreviewAccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "tags" | "perks">("orders");
  const [emptySimulation, setEmptySimulation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentOrders, setRecentOrders, ordersReady] = useLocal<string[]>("zl_orders", []);
  const [savedPlayerIds, setSavedPlayerIds, playersReady] = useLocal<Record<string, string>>("zl_player_ids", {});

  const playerEntries = Object.entries(savedPlayerIds);

  function copyDeviceId() {
    navigator.clipboard?.writeText("ZL-DEV-9924-LAGOS").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function clearDeviceHistory() {
    setRecentOrders([]);
    setSavedPlayerIds({});
  }

  const isEmpty = emptySimulation || (ordersReady && recentOrders.length === 0 && playerEntries.length === 0);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 flex flex-col gap-6 font-stitch pb-24">
      {/* Hero Banner: Deep Navy (#0F1B4D) verbatim from Stitch 9cb16036e9174b16a36fa85c9044614e.html */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0F1B4D] border border-surface-variant/20 p-6 sm:p-8 md:p-10 text-surface-container-lowest shadow-lg">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-tertiary-container/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-secondary-container border border-secondary-container/30 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">offline_pin</span>
              <span>Zero Passwords • Local Browser Storage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white pt-1">
              Device Account Hub
            </h1>
            <p className="text-xs sm:text-sm text-outline-variant leading-relaxed">
              Saved locally on this device. No passwords or registration needed. Instant access to transactions, player tags, and loyalty rewards.
            </p>
          </div>

          {/* Device Token Card verbatim from Stitch */}
          <div className="bg-on-background/70 backdrop-blur-md border border-surface-variant/30 rounded-xl p-4 sm:p-5 flex flex-col gap-3 min-w-[280px] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-outline-variant uppercase tracking-wider font-bold">Device Token Identity</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary-container">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                Encrypted
              </span>
            </div>
            <div className="flex items-center justify-between bg-surface-container-lowest/5 rounded-lg px-3 py-2 border border-surface-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container text-lg">smartphone</span>
                <span className="text-xs sm:text-sm font-bold tracking-wide text-white font-mono">ZL-DEV-9924-LAGOS</span>
              </div>
              <button
                type="button"
                onClick={copyDeviceId}
                className="text-outline-variant hover:text-secondary-container active:scale-90 transition-transform"
                title="Copy Device Token"
              >
                <span className="material-symbols-outlined text-base">
                  {copied ? "check" : "content_copy"}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 border border-surface-variant/20 text-surface-container-lowest text-xs font-semibold active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">sync</span>
                <span>Sync Cloud</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 border border-surface-variant/20 text-surface-container-lowest text-xs font-semibold active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">key</span>
                <span>Backup</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar: Tab Navigation & Empty State Toggle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
        {/* 3 Primary Tabs */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-variant/40 overflow-x-auto" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === "orders"
                ? "bg-surface-container-lowest text-primary shadow-sm border border-surface-variant/20"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            <span>Saved Orders</span>
            <span className="ml-1 text-[10px] font-extrabold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {recentOrders.length > 0 ? recentOrders.length : 2}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tags")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === "tags"
                ? "bg-surface-container-lowest text-primary shadow-sm border border-surface-variant/20"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">badge</span>
            <span>Saved Player Tags</span>
            <span className="ml-1 text-[10px] font-extrabold bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded-full">
              {playerEntries.length > 0 ? playerEntries.length : 2}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("perks")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === "perks"
                ? "bg-surface-container-lowest text-primary shadow-sm border border-surface-variant/20"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">military_tech</span>
            <span>Loyalty & Perks</span>
            <span className="ml-1 text-[10px] font-extrabold bg-secondary-container/20 text-on-secondary-container px-1.5 py-0.5 rounded-full">
              New
            </span>
          </button>
        </div>

        {/* Quick Switch State Toggle (Empty State Simulation) */}
        <div className="flex items-center gap-2 self-end sm:self-auto bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-surface-variant/40 shadow-sm">
          <label className="text-xs text-on-surface-variant cursor-pointer select-none">
            Simulate Empty State:
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={emptySimulation}
            onClick={() => setEmptySimulation(!emptySimulation)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              emptySimulation ? "bg-primary" : "bg-surface-variant"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow ring-0 transition duration-200 ease-in-out ${
                emptySimulation ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Empty State View verbatim from Stitch */}
      {isEmpty ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-2xl border border-surface-variant/40 p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-3xl">cloud_off</span>
          </div>
          <h3 className="text-xl sm:text-2xl text-on-surface font-extrabold mb-2">
            No orders or player tags found on this device yet
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
            Top-up any game instantly with your Nigerian bank card, transfer, or OPay. Your order receipt and player UID will automatically save to this browser.
          </p>
          <Link
            href="/preview/games"
            className="custom-gradient-cta text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all inline-flex items-center gap-2 brand-glow"
          >
            <span className="material-symbols-outlined text-[18px]">sports_esports</span>
            <span>Explore Instant Games</span>
          </Link>
        </div>
      ) : (
        <div>
          {/* TAB 1: SAVED ORDERS */}
          {activeTab === "orders" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Recent Browser Top-Ups</h2>
                  <p className="text-xs text-on-surface-variant">Validated via Paystack gateway and instant server delivery</p>
                </div>
                <button
                  type="button"
                  onClick={clearDeviceHistory}
                  className="inline-flex items-center gap-1 text-xs text-outline hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete_sweep</span>
                  <span>Clear browser data</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Order 1: Free Fire 520 Diamonds */}
                <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-orange-600 text-2xl">local_fire_department</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base text-on-surface font-bold">Free Fire</span>
                        <span className="text-xs text-outline">•</span>
                        <span className="text-sm font-bold text-primary">520 Diamonds</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Delivered
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant text-xs">
                        <span>Player UID: <strong className="text-on-surface font-mono">782910****</strong></span>
                        <span>Server: <strong>Global / Africa</strong></span>
                        <span>Amount: <strong className="text-on-surface">₦4,250.00</strong></span>
                      </div>
                      <div className="text-[11px] text-outline">
                        Ref: ZNL-FF-99421 • Oct 24, 2025 at 14:32 WAT • Instant Card
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Link
                      href="/preview/orders/ZL-20261005-A1B2C3D4"
                      className="px-4 py-2 rounded-xl border border-surface-variant/60 bg-surface-container-lowest hover:border-primary text-on-surface text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">receipt</span>
                      <span>Receipt</span>
                    </Link>
                    <Link
                      href="/preview/games/free-fire"
                      className="custom-gradient-cta text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 brand-glow"
                    >
                      <span className="material-symbols-outlined text-base">bolt</span>
                      <span>Top up again</span>
                    </Link>
                  </div>
                </div>

                {/* Order 2: COD Mobile 420 CP */}
                <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-blue-700 text-2xl">military_tech</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base text-on-surface font-bold">Call of Duty: Mobile</span>
                        <span className="text-xs text-outline">•</span>
                        <span className="text-sm font-bold text-primary">420 CP Points</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Delivered
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant text-xs">
                        <span>Player UID: <strong className="text-on-surface font-mono">682019****</strong></span>
                        <span>Server: <strong>Global Activision</strong></span>
                        <span>Amount: <strong className="text-on-surface">₦1,200.00</strong></span>
                      </div>
                      <div className="text-[11px] text-outline">
                        Ref: ZL-20261004-9X8Y7Z • Yesterday • Bank Transfer
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Link
                      href="/preview/orders/ZL-20261004-9X8Y7Z"
                      className="px-4 py-2 rounded-xl border border-surface-variant/60 bg-surface-container-lowest hover:border-primary text-on-surface text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">receipt</span>
                      <span>Receipt</span>
                    </Link>
                    <Link
                      href="/preview/games/codm"
                      className="custom-gradient-cta text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 brand-glow"
                    >
                      <span className="material-symbols-outlined text-base">bolt</span>
                      <span>Top up again</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: SAVED PLAYER TAGS */}
          {activeTab === "tags" && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Your Quick In-Game UIDs</h2>
                  <p className="text-xs text-on-surface-variant">Pre-fills instantly during checkout so you never mistype your gamer tag</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary uppercase">Free Fire (Africa)</span>
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Verified UID</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-on-surface">
                    2938102924
                  </div>
                  <div className="pt-2 border-t border-surface-variant/20 flex items-center justify-between">
                    <span className="text-xs text-outline">Nick: GhostRider_NG</span>
                    <Link href="/preview/games/free-fire" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      <span>Top Up</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-secondary uppercase">CODM (Global)</span>
                    <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Verified UID</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-on-surface">
                    682019284110
                  </div>
                  <div className="pt-2 border-t border-surface-variant/20 flex items-center justify-between">
                    <span className="text-xs text-outline">Nick: DeltaSniper99</span>
                    <Link href="/preview/games/codm" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      <span>Top Up</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: LOYALTY & PERKS */}
          {activeTab === "perks" && (
            <section className="space-y-4">
              <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-xl p-6 sm:p-8 shadow-sm text-center max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container/20 text-secondary-container flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">military_tech</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface">Naira Gamer Cashbacks</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Earn instant 2% - 5% rebate credits on every 10th consecutive order placed from this device. Zero sign-up required.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-xs font-bold text-outline">
                  <span>Launching Q4 2026 across Lagos & Abuja servers</span>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
