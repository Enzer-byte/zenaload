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
          ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
          : "border-line bg-card/80 text-ink2"
      }`}
      title={
        isLow
          ? `Low Balance: ${formattedBalance} is below $25 threshold. Please top up your supplier wallet.`
          : `Supplier Balance: ${formattedBalance} (${currency})`
      }
    >
      <div className="flex items-center gap-1.5">
        <span className="text-mute">Supplier Balance:</span>
        <span className="font-semibold text-ink">
          {loading && balance === null ? (
            <span className="inline-block animate-pulse text-mute">Checking...</span>
          ) : (
            formattedBalance
          )}
        </span>
        {isMock && (
          <span
            className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-mute"
            title="Simulated sandbox balance"
          >
            MOCK
          </span>
        )}
      </div>

      {isLow && !loading && (
        <span
          className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300"
          title="Low Balance (< $25 threshold)"
        >
          Low Balance
        </span>
      )}

      {error && !loading && (
        <span className="text-[10px] text-red-400" title={error}>
          Offline
        </span>
      )}

      <button
        type="button"
        onClick={fetchBalance}
        disabled={loading}
        aria-label="Refresh supplier balance"
        title="Refresh live balance"
        className="ml-0.5 rounded p-1 text-mute hover:bg-elevated hover:text-ink focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-50"
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform ${loading ? "animate-spin text-hi" : ""}`}
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
