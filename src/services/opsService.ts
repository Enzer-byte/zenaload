import { randomBytes } from "crypto";
import { opsStore } from "@/repositories/opsStore";
import type { Notice } from "@/types";
const id = (p: string) => `${p}-${randomBytes(3).toString("hex").toUpperCase()}`;
export async function notifyAdmin(level: Notice["level"], title: string, detail: string, orderId?: string) {
  try { await opsStore.addNotice({ id: id("N"), level, title, detail, orderId, read: false, createdAt: new Date().toISOString() }); } catch (e) { console.error("notify failed", e); } // never break order flow
}
export async function createTicket(i: { email: string; orderId?: string; message: string }) {
  const t = { id: id("TK"), orderId: i.orderId?.trim().toUpperCase() || undefined, email: i.email, subject: i.orderId ? `Help with order ${i.orderId.trim().toUpperCase()}` : "General question", message: i.message, open: true, createdAt: new Date().toISOString() };
  await opsStore.addTicket(t); await notifyAdmin("info", "New support ticket", `${t.id}: ${t.subject}`, t.orderId); return t;
}
