import { queue } from "@/lib/queue";
import { orderStore } from "@/repositories/orderStore";
import { webhookEvents } from "@/repositories/webhookEvents";
import { paymentService } from "./paymentService";
import "./fulfilmentWorker"; // registers the queue handler
// The ONLY path that marks an order paid (real webhook route and the mock gateway both call it).
export async function handleChargeSuccess(eventId: string, reference: string, amountKobo?: number) {
  if (!(await webhookEvents.recordOnce("paystack", eventId))) return "duplicate" as const;
  const existing = await orderStore.getByPaymentRef(reference);
  if (!existing) return "unknown_order" as const;
  if (existing.payment === "PAID") return "already_paid" as const;
  if (amountKobo !== undefined && amountKobo !== existing.amount * 100) return "amount_mismatch" as const;
  if (!(await paymentService.verify(reference))) return "unverified" as const;
  if (!(await orderStore.claimPaid(reference, "Payment verified"))) return "already_paid" as const; // atomic: loser of a race stops here
  queue.enqueue("fulfil-order", { orderId: existing.id });
  return "queued" as const;
}
