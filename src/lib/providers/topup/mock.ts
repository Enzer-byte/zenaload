import type { TopupProvider } from "@/types";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const MockTopupProvider: TopupProvider = {
  id: "mock",
  async getProducts() { return []; },
  async validatePlayer(_g, f) { return Object.values(f).length > 0 && Object.values(f).every((v) => /^\d{6,12}$/.test(v)); },
  async createTopup({ idempotencyKey }) { await sleep(2000); return { txId: "SUP-" + idempotencyKey.slice(-6), status: "SUCCESSFUL" }; },
  async getTransactionStatus() { return "SUCCESSFUL"; },
  async refundTransaction() { return true; },
  async getBalance() { return 1_000_000; },
};
