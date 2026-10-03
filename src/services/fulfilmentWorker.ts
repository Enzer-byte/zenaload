import { catalogStore } from "@/repositories/catalogStore";
import { setFulfillment } from "@/lib/orderStateMachine";
import { queue } from "@/lib/queue";
import { routeTopup } from "@/lib/supplierRouter";
import { getTopupProvider } from "@/lib/providers/topup";
import { orderStore } from "@/repositories/orderStore";
import { notifyAdmin } from "./opsService";
import { notificationService } from "./notificationService";
queue.register("fulfil-order", async ({ orderId }) => orderStore.withLock(orderId, async (o) => {
  if (o.payment !== "PAID" || o.fulfillment === "SUCCESSFUL" || o.fulfillment === "FAILED") return; // safe to run twice
  if (o.fulfillment === "NOT_STARTED") setFulfillment(o, "PROCESSING", "Top-up processing");
  o.retryCount = (o.retryCount ?? 0) + 1; await orderStore.save(o);
  const game = (await catalogStore.games()).find((g) => g.id === o.gameId)!, prod = (await catalogStore.products()).find((p) => p.id === o.productId)!;
  let status;
  if (o.supplierTxId) status = await getTopupProvider(game.supplierId).getTransactionStatus(o.supplierTxId); // already reached supplier: check, never re-create
  else { const r = await routeTopup({ idempotencyKey: o.id, supplierProductId: prod.supplierProductId, fields: o.playerFields }); o.supplierTxId = r.txId; status = r.status; await orderStore.save(o); } // persist the supplier ref immediately
  if (status === "SUCCESSFUL") { setFulfillment(o, "SUCCESSFUL", "Top-up delivered"); await orderStore.save(o); await notificationService.send(o.customer.email, `Your top-up ${o.id} was delivered.`); }
  else if (status === "FAILED") { setFulfillment(o, "FAILED", "Supplier rejected the top-up"); await orderStore.save(o); await notifyAdmin("error", "Top-up failed", `Order ${o.id} was rejected by the supplier. Retry or refund.`, o.id); }
  else { setFulfillment(o, "PENDING_REVIEW", "Top-up pending at supplier"); await orderStore.save(o); await notifyAdmin("warn", "Top-up needs review", `Order ${o.id} is pending at the supplier.`, o.id); }
}), async (d) => { const o = await orderStore.get(d.orderId); if (o && o.fulfillment === "PROCESSING") { setFulfillment(o, "PENDING_REVIEW", "Retries exhausted: manual review"); o.errorMessage = "Your payment is safe. We're checking your top-up."; await orderStore.save(o); await notifyAdmin("warn", "Retries exhausted", `Order ${o.id} needs manual review.`, o.id); } });
