import type { FulfillmentStatus, Order, PaymentStatus } from "@/types";
const PAY: Record<PaymentStatus, PaymentStatus[]> = { UNPAID: ["PAYMENT_PENDING"], PAYMENT_PENDING: ["PAID", "PAYMENT_FAILED"], PAID: ["REFUNDED"], PAYMENT_FAILED: ["PAYMENT_PENDING"], REFUNDED: [] };
const FUL: Record<FulfillmentStatus, FulfillmentStatus[]> = { NOT_STARTED: ["PROCESSING"], PROCESSING: ["SUCCESSFUL", "FAILED", "PENDING_REVIEW"], PENDING_REVIEW: ["PROCESSING", "SUCCESSFUL", "FAILED"], FAILED: ["PROCESSING"], SUCCESSFUL: [] };
const log = (o: Order, label: string) => { const at = new Date().toISOString(); o.updatedAt = at; o.events.push({ at, label }); };
export function setPayment(o: Order, to: PaymentStatus, label: string) { if (!PAY[o.payment].includes(to)) throw new Error(`Illegal payment transition ${o.payment} -> ${to}`); o.payment = to; log(o, label); }
export function setFulfillment(o: Order, to: FulfillmentStatus, label: string) {
  if (to === "PROCESSING" && o.payment !== "PAID") throw new Error("Cannot fulfil an unpaid order");
  if (!FUL[o.fulfillment].includes(to)) throw new Error(`Illegal fulfillment transition ${o.fulfillment} -> ${to}`); // blocks duplicate fulfilment after SUCCESSFUL
  o.fulfillment = to; log(o, label);
}
