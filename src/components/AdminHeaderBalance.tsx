"use client";

import { useEffect, useState, useCallback } from "react";

interface BalanceResponse {
  ok: boolean;
  balance?: number;
  currency?: "USD" | "NGN";
  mock?: boolean;
  warning?: string;
  error?: string;
}

export function AdminHeaderBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [loading, setLoading] = useState<boolean>(true);
  const [isMock, setIsMock] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/supplier/balance", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: BalanceResponse = await res.json();
      if (data.ok && typeof data.balance === "number") {
        setBalance(data.balance);
        if (data.currency) setCurrency(data.currency);
        setIsMock(Boolean(data.mock));
      } else {
        setError(data.error || "Failed to load balance");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const isLow = balance !== null && balance < 25;

  const formattedBalance =
    balance === null
      ? "—"
      : currency === "USD"
      ? `$${balance.toFixed(2)}`
      : `₦${balance.toLocaleString()}`;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
        isLow
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-[#E0E5F1] bg-white text-slate-700 shadow-sm"
      }`}
      title={
        isLow
          ? `Low Balance: ${formattedBalance} is below $25 threshold. Please top up your supplier wallet.`
          : `Supplier Balance: ${formattedBalance} (${currency})`
      }
    >
      <div className="flex items-center gap-1.5">
        <span className={isLow ? "text-amber-700 font-medium" : "text-slate-500"}>Supplier Balance:</span>
        <span className={`font-bold ${isLow ? "text-amber-900" : "text-slate-900"}`}>
          {loading && balance === null ? (
            <span className="inline-block animate-pulse text-slate-400">Checking...</span>
          ) : (
            formattedBalance
          )}
        </span>
        {isMock && (
          <span
            className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600"
            title="Simulated sandbox balance"
          >
            MOCK
          </span>
        )}
      </div>

      {isLow && !loading && (
        <span
          className="rounded bg-amber-200 border border-amber-300 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900"
          title="Low Balance (< $25 threshold)"
        >
          Low Balance
        </span>
      )}

      {error && !loading && (
        <span className="text-[10px] font-medium text-red-600" title={error}>
          Offline
        </span>
      )}

      <button
        type="button"
        onClick={fetchBalance}
        disabled={loading}
        aria-label="Refresh supplier balance"
        title="Refresh live balance"
        className={`ml-0.5 rounded p-1 focus:outline-none transition-colors ${
          isLow
            ? "text-amber-700 hover:text-amber-900 hover:bg-amber-100/60"
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        } disabled:opacity-50`}
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform ${loading ? "animate-spin text-[#1E3BCB]" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
      </button>
    </div>
  );
}
