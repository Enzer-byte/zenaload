import type { Order, OrderStore } from "@/types";
import { setPayment } from "@/lib/orderStateMachine";
const g = globalThis as unknown as { __orders?: Map<string, Order>; __locks?: Set<string> };
const m: Map<string, Order> = (g.__orders ??= new Map()), locks: Set<string> = (g.__locks ??= new Set());
export const memoryOrderStore: OrderStore = {
  get: async (id) => m.get(id.trim().toUpperCase()) ?? null,
  getByPaymentRef: async (ref) => [...m.values()].find((o) => o.paymentRef === ref) ?? null,
  create: async (o) => void m.set(o.id, o),
  list: async (limit = 200) => [...m.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit),
  save: async (o) => void m.set(o.id, o),
  async claimPaid(ref, label) { const o = [...m.values()].find((x) => x.paymentRef === ref); if (!o || o.payment !== "PAYMENT_PENDING") return null; setPayment(o, "PAID", label); return o; },
  async withLock(id, fn) { const k = id.toUpperCase(), o = m.get(k); if (!o || locks.has(k)) return; locks.add(k); try { await fn(o); } finally { locks.delete(k); } },
};
