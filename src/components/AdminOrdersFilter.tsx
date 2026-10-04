"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { ngn } from "@/config";
import type { Order } from "@/types";

type StatusFilter =
  | "All"
  | "PAID"
  | "PROCESSING"
  | "SUCCESSFUL"
  | "FAILED"
  | "PENDING_REVIEW"
  | "UNPAID";

const FILTERS: StatusFilter[] = [
  "All",
  "PAID",
  "PROCESSING",
  "SUCCESSFUL",
  "FAILED",
  "PENDING_REVIEW",
  "UNPAID",
];

interface AdminOrdersFilterProps {
  orders: Order[];
  gamesMap: Record<string, string>;
}

export function AdminOrdersFilter({ orders, gamesMap }: AdminOrdersFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

  const statusCounts = useMemo(() => {
    return {
      All: orders.length,
      PAID: orders.filter((o) => o.payment === "PAID").length,
      PROCESSING: orders.filter((o) => o.fulfillment === "PROCESSING").length,
      SUCCESSFUL: orders.filter((o) => o.fulfillment === "SUCCESSFUL").length,
      FAILED: orders.filter((o) => o.fulfillment === "FAILED" || o.payment === "PAYMENT_FAILED").length,
      PENDING_REVIEW: orders.filter((o) => o.fulfillment === "PENDING_REVIEW").length,
      UNPAID: orders.filter((o) => o.payment === "UNPAID" || o.payment === "PAYMENT_PENDING").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return orders.filter((o) => {
      // 1. Status Filter
      if (activeFilter === "PAID" && o.payment !== "PAID") return false;
      if (activeFilter === "PROCESSING" && o.fulfillment !== "PROCESSING") return false;
      if (activeFilter === "SUCCESSFUL" && o.fulfillment !== "SUCCESSFUL") return false;
      if (activeFilter === "FAILED" && !(o.fulfillment === "FAILED" || o.payment === "PAYMENT_FAILED")) return false;
      if (activeFilter === "PENDING_REVIEW" && o.fulfillment !== "PENDING_REVIEW") return false;
      if (activeFilter === "UNPAID" && !(o.payment === "UNPAID" || o.payment === "PAYMENT_PENDING")) return false;

      // 2. Query Search
      if (!q) return true;

      const searchableFields = [
        o.id,
        o.customer?.email,
        o.customer?.phone,
        ...Object.values(o.playerFields || {}),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableFields.includes(q);
    });
  }, [orders, activeFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Filter Pill Buttons with Counts */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((pill) => {
          const count = statusCounts[pill];
          const isActive = activeFilter === pill;
          const isPendingHighlight = pill === "PENDING_REVIEW" && count > 0;

          return (
            <button
              key={pill}
              type="button"
              onClick={() => setActiveFilter(pill)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "border-brand bg-brand text-white shadow-sm"
                  : isPendingHighlight
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                  : "border-line bg-card text-ink2 hover:border-slate-600 hover:bg-elevated hover:text-ink"
              }`}
            >
              <span>{pill === "All" ? "All Orders" : pill.replace("_", " ")}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : isPendingHighlight
                    ? "bg-amber-500/20 text-amber-200"
                    : "bg-elevated text-mute"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instant Search Box */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-mute">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search orders"
          placeholder="Search by Order ID (ZL-...), customer email, phone, or Player ID..."
          className="w-full rounded-xl border border-line bg-bg2 py-2.5 pl-9 pr-10 text-sm text-ink placeholder:text-mute focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-mute hover:text-ink"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-mute">
        <span>
          Showing {filteredOrders.length} of {orders.length} orders
          {activeFilter !== "All" && ` · Filter: ${activeFilter}`}
          {searchQuery && ` · Matching "${searchQuery}"`}
        </span>
        {(searchQuery || activeFilter !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("All");
            }}
            className="text-hi hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Orders Table or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-8 text-center">
          <p className="text-sm text-ink2">No orders match your filter criteria.</p>
          {(searchQuery || activeFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="mt-3 inline-block rounded-lg bg-elevated px-4 py-2 text-xs font-medium text-ink hover:bg-line"
            >
              Clear filter and show all
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-line bg-bg2/50 text-left text-xs uppercase tracking-wider text-mute">
              <tr>
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Game</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Payment</th>
                <th className="p-3 font-medium">Fulfilment</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-elevated/40">
                  <td className="p-3 font-mono text-xs font-medium text-ink">
                    <Link href={`/admin/orders/${o.id}`} className="hover:text-hi">
                      {o.id}
                    </Link>
                  </td>
                  <td className="p-3 text-xs">
                    <div className="font-medium text-ink">{o.customer.email}</div>
                    {o.customer.phone && <div className="text-mute">{o.customer.phone}</div>}
                  </td>
                  <td className="p-3 text-xs text-ink2">
                    {gamesMap[o.gameId] || o.gameId}
                  </td>
                  <td className="p-3 text-xs font-semibold text-ink">
                    {ngn(o.amount)}
                  </td>
                  <td className="p-3 text-xs">
                    <Badge s={o.payment} />
                  </td>
                  <td className="p-3 text-xs">
                    <Badge s={o.fulfillment} />
                  </td>
                  <td className="p-3 text-xs text-mute whitespace-nowrap">
                    {o.createdAt.slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="p-3 text-right text-xs">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="rounded bg-elevated px-2.5 py-1 font-medium text-hi hover:bg-brand/20 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
