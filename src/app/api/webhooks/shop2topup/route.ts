import { NextResponse } from "next/server";
import { verifyShop2topupSignature } from "@/lib/shop2topupSignature";
import { orderStore } from "@/repositories/orderStore";
import { setFulfillment } from "@/lib/orderStateMachine";
import { notifyAdmin } from "@/services/opsService";
import { notificationService } from "@/services/notificationService";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-shop2topup-signature");
  const event = req.headers.get("x-shop2topup-event");

  // Webhook test ping
  if (event === "webhook.test") {
    return NextResponse.json({ ok: true, message: "Webhook test received" });
  }

  // Signature verification (only if secret is configured)
  if (process.env.SHOP2TOPUP_WEBHOOK_SECRET) {
    if (!verifyShop2topupSignature(raw, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: {
    event?: string;
    data?: {
      order_id?: string;
      status?: "completed" | "refunded" | "failed";
      completed_at?: string;
      reason?: string;
    };
  };

  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON payload" }, { status: 400 });
  }

  const orderId = payload.data?.order_id;
  const status = payload.data?.status;

  if (!orderId || !status) {
    return NextResponse.json({ received: true, ignored: true });
  }

  // Look up order by supplierTxId or Zenaload order ID
  let order = orderStore.getBySupplierTxId ? await orderStore.getBySupplierTxId(orderId) : null;
  if (!order) {
    order = await orderStore.get(orderId);
  }

  if (!order) {
    // Return 200 so supplier doesn't spam retries for unknown orders
    return NextResponse.json({ received: true, not_found: true });
  }

  await orderStore.withLock(order.id, async (o) => {
    if (status === "completed" && o.fulfillment !== "SUCCESSFUL") {
      setFulfillment(o, "SUCCESSFUL", "Top-up completed by Shop2topup");
      await orderStore.save(o);
      await notificationService.send(o.customer.email, `Your top-up ${o.id} was delivered.`);
    } else if ((status === "refunded" || status === "failed") && o.fulfillment !== "FAILED") {
      setFulfillment(o, "FAILED", `Shop2topup: ${payload.data?.reason ?? "Top-up failed or refunded"}`);
      await orderStore.save(o);
      await notifyAdmin("error", "Top-up failed at Shop2topup", `Order ${o.id} failed or was refunded by Shop2topup.`, o.id);
    }
  });

  return NextResponse.json({ received: true, status });
}
