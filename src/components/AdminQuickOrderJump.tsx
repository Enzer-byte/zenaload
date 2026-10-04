"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminQuickOrderJump() {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function validate(input: string): string | null {
    const trimmed = input.trim();
    if (!trimmed) {
      return "Please enter an Order ID";
    }

    const upper = trimmed.toUpperCase();
    if (!upper.startsWith("ZL-") && !upper.startsWith("GF-")) {
      return "Order ID must begin with 'ZL-' or 'GF-' (e.g. ZL-20261004-9F3A1C7E)";
    }

    const suffix = upper.slice(3);
    if (!suffix) {
      return "Incomplete Order ID. Please provide the full reference";
    }

    if (!/^[A-Z0-9_-]+$/.test(suffix)) {
      return "Order ID contains invalid characters. Use letters, digits, or hyphens";
    }

    return null;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setOrderId(val);
    if (error) {
      // Clear error immediately on change if resolved or empty
      const trimmed = val.trim();
      if (!trimmed) {
        setError(null);
      } else {
        const err = validate(val);
        setError(err);
      }
    }
  }

  function handleJump(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orderId.trim();
    const validationErr = validate(trimmed);

    if (validationErr) {
      setError(validationErr);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const targetId = trimmed.toUpperCase();
    router.push(`/admin/orders/${targetId}`);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleJump} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-mute">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={orderId}
            onChange={handleChange}
            placeholder="Instant Order ID lookup (e.g. ZL-20261004-9F3A1C7E or GF-T-1)..."
            aria-label="Quick Order ID Jump"
            className={`w-full rounded-xl border bg-bg2/90 pl-10 pr-20 py-2.5 font-mono text-xs sm:text-sm text-ink placeholder-mute transition focus:outline-none focus:ring-1 ${
              error
                ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/50"
                : "border-line focus:border-brand focus:ring-brand"
            }`}
          />
          {orderId && (
            <button
              type="button"
              onClick={() => {
                setOrderId("");
                setError(null);
              }}
              className="absolute inset-y-0 right-2 flex items-center px-2 text-xs text-mute hover:text-ink"
              aria-label="Clear Order ID input"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand/90 hover:brightness-110 active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Navigating...
            </span>
          ) : (
            <>
              <span>Find Order</span>
              <span className="font-mono text-[10px] text-ink2 bg-white/10 px-1 rounded">↵</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400 animate-fadeIn" role="alert">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default AdminQuickOrderJump;
