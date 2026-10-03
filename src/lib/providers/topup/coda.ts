import type { TopupProvider } from "@/types";
import { real, supplierRequest } from "./http";
// SHELL. Fill in once Coda approves your KYB and gives you sandbox docs. Placeholders are env vars (see .env.example, docs/SUPPLIERS.md).
export const isCodaConfigured = () => real(process.env.CODA_API_KEY) && real(process.env.CODA_API_BASE_URL);
const call = <T,>(path: string, body?: unknown) => supplierRequest<T>({ configured: isCodaConfigured(), name: "Coda", url: `${process.env.CODA_API_BASE_URL}${path}`, headers: { /* TODO(Coda docs): auth/signature headers using CODA_API_KEY */ }, body });
const todo = (what: string): never => { throw new Error(`Coda ${what}: endpoint mapping not implemented yet (TODO per Coda docs)`); };
export const CodaProvider: TopupProvider = {
  id: "coda",
  async getProducts() { await call("/TODO-products"); return todo("getProducts"); },
  async validatePlayer(_gameId, _fields) { await call("/TODO-validate", { /* player id fields */ }); return todo("validatePlayer"); }, // Coda: validate Player ID before checkout
  async createTopup(_i) { await call("/TODO-topup", { /* idempotency key = _i.idempotencyKey (confirm Coda supports one); return { txId, status } */ }); return todo("createTopup"); },
  async getTransactionStatus(_txId) { await call("/TODO-status"); return todo("getTransactionStatus"); },
  async refundTransaction(_txId) { return todo("refundTransaction"); },
  async getBalance() { await call("/TODO-balance"); return todo("getBalance"); },
};
