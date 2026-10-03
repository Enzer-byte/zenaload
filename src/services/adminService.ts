import { queue } from "@/lib/queue";
import { setFulfillment, setPayment } from "@/lib/orderStateMachine";
import { orderStore } from "@/repositories/orderStore";
import { paymentService } from "./paymentService";
import "./fulfilmentWorker";
export type AdminAction = "retry" | "review" | "refund" | "note";
export async function adminAction(id: string, action: AdminAction, note?: string): Promise<{ ok: boolean; message: string }> {
  let ok = false, message = "This order is busy right now. Try again in a moment.";
  const stamp = (o: { events: { at: string; label: string }[] }, label: string) => o.events.push({ at: new Date().toISOString(), label });
  await orderStore.withLock(id, async (o) => {
    if (action === "note") { if (!note?.trim()) { message = "Write a note first."; return; } stamp(o, `Admin note: ${note.trim().slice(0, 500)}`); await orderStore.save(o); ok = true; message = "Note saved."; return; }
    if (action === "review") {
      if (o.fulfillment !== "PROCESSING") { message = "Only orders being processed can be marked for review."; return; }
      setFulfillment(o, "PENDING_REVIEW", "Marked for review by admin"); await orderStore.save(o); ok = true; message = "Marked for review."; return;
    }
    if (action === "retry") { // duplicate-fulfilment safeguards
      if (o.payment !== "PAID") { message = "Blocked: payment isn't confirmed."; return; }
      if (o.fulfillment === "SUCCESSFUL") { message = `Blocked: already delivered (supplier ref ${o.supplierTxId}). Retrying would duplicate the top-up.`; return; }
      if (o.fulfillment === "PROCESSING") { message = "Blocked: fulfilment is already in progress."; return; }
      if (o.fulfillment === "FAILED") o.supplierTxId = undefined; // supplier definitively rejected, so a fresh attempt is safe. For PENDING_REVIEW the worker checks the existing supplier ref first.
      setFulfillment(o, "PROCESSING", "Retry requested by admin"); await orderStore.save(o); ok = true; message = "Retry queued."; return;
    }
    if (action === "refund") {
      if (o.payment !== "PAID" || !o.paymentRef) { message = "Blocked: only paid orders can be refunded."; return; }
      if (!["FAILED", "PENDING_REVIEW"].includes(o.fulfillment)) { message = "Blocked: refunds are only for failed or pending-review orders, so a delivered top-up is never refunded."; return; }
      await paymentService.refund(o.paymentRef); // throws (customer-safe message) if Paystack isn't configured
      setPayment(o, "REFUNDED", "Refund issued by admin"); await orderStore.save(o); ok = true; message = "Refund issued.";
    }
  });
  if (ok && action === "retry") queue.enqueue("fulfil-order", { orderId: id });
  return { ok, message };
}
