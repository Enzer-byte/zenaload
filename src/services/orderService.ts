import { randomBytes } from "crypto";
import type { Order } from "@/types";
import { config } from "@/config";
import { catalogStore } from "@/repositories/catalogStore";
import { UserFacingError } from "@/lib/errors";
import { setPayment } from "@/lib/orderStateMachine";
import { orderStore } from "@/repositories/orderStore";
import { handleChargeSuccess } from "./paymentEvents";
import { paymentService } from "./paymentService";
import { productService } from "./productService";
import { topupService } from "./topupService";
export const orderService = {
  get: (id: string) => orderStore.get(id),
  async create(input: { productId: string; playerFields: Record<string, string>; customer: Order["customer"] }): Promise<Order> {
    const product = await productService.getProduct(input.productId);
    const game = product && (await catalogStore.games()).find((x) => x.id === product.gameId);
    if (!product || !game) throw new Error("Product not found");
    for (const f of game.playerFields) {
      const val = input.playerFields[f.key] ?? "";
      if (f.pattern && !new RegExp(f.pattern).test(val)) {
        throw new Error(`Please enter a valid ${f.label}.`);
      }
    }
    if (!(await topupService.validate(game.supplierId, game.id, input.playerFields))) throw new Error("Please enter a valid Player ID.");
    const now = new Date().toISOString(), d = now.slice(0, 10).replace(/-/g, "");
    const order: Order = { id: `${config.orderPrefix}-${d}-${randomBytes(4).toString("hex").toUpperCase()}`, gameId: game.id, productId: product.id, playerFields: input.playerFields, customer: input.customer, amount: product.retailPrice, currency: config.currency, payment: "UNPAID", fulfillment: "NOT_STARTED", createdAt: now, updatedAt: now, events: [{ at: now, label: "Order created" }] };
    await orderStore.create(order);
    if (config.paymentProvider === "mock") { void orderService.startPayment(order); return order; } // demo: simulated gateway
    const paymentUrl = await orderService.startPayment(order); // real gateway: browser is sent to the hosted payment page
    if (!paymentUrl) throw new UserFacingError(order.errorMessage ?? "We couldn't start your payment. You have not been charged.");
    return { ...order, paymentUrl };
  },
  async startPayment(o: Order): Promise<string | undefined> {
    try {
      setPayment(o, "PAYMENT_PENDING", "Payment initialised"); await orderStore.save(o);
      const pay = await paymentService.initialize({ orderId: o.id, amount: o.amount, email: o.customer.email });
      o.paymentRef = pay.reference; await orderStore.save(o);
      if (pay.status === "FAILED") { setPayment(o, "PAYMENT_FAILED", "Payment failed"); await orderStore.save(o); return; }
      if (pay.redirectUrl) return pay.redirectUrl; // fulfilment starts ONLY when the Paystack webhook confirms payment
      if (config.paymentProvider === "mock") await handleChargeSuccess(`mock:${pay.reference}`, pay.reference, o.amount * 100);
    } catch (e) {
      o.errorMessage = e instanceof UserFacingError ? e.message : "We couldn't complete your payment right now. You have not been charged.";
      if (o.payment === "PAYMENT_PENDING") setPayment(o, "PAYMENT_FAILED", "Could not start payment");
      await orderStore.save(o); console.error(e);
    }
  },
};
