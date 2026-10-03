import type { PaymentProvider } from "@/types";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const MockPaymentProvider: PaymentProvider = {
  id: "mock",
  async initializePayment() { await sleep(1200); return { reference: "PAY-" + Math.random().toString(36).slice(2, 10).toUpperCase(), status: "PAID" }; },
  async verifyPayment() { await sleep(800); return true; },
  async handleWebhook() { return null; },
  async refundPayment() { return true; },
  async getTransaction(ref) { return { ref, mock: true }; },
};
