"use client";
import { useEffect, useState } from "react";
// Guest data kept on this device only (no account needed).
export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init), [ready, setReady] = useState(false);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch {} setReady(true); }, [key]);
  const set = (n: T) => { setV(n); try { localStorage.setItem(key, JSON.stringify(n)); } catch {} };
  return [v, set, ready] as const;
}
export function rememberOrder(id: string) { try { const l: string[] = JSON.parse(localStorage.getItem("zl_orders") ?? "[]"); if (!l.includes(id)) localStorage.setItem("zl_orders", JSON.stringify([id, ...l].slice(0, 30))); } catch {} }
