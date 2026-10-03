import type { TopupProvider } from "@/types";
import { real, supplierRequest } from "./http";
// SHELL (fallback supplier). Reloadly returns redeemable CODES, not direct top-ups: when you wire it, show the code + redemption steps on the
// order page and store it encrypted (never in order events, logs or public order data).
export const isReloadlyConfigured = () => real(process.env.RELOADLY_CLIENT_ID) && real(process.env.RELOADLY_CLIENT_SECRET) && real(process.env.RELOADLY_API_BASE);
let token: { value: string; exp: number } | null = null;
async function getToken(): Promise<string> { // OAuth2 client-credentials
  if (token && token.exp > Date.now() + 60_000) return token.value;
  const r = await supplierRequest<{ access_token: string; expires_in: number }>({ configured: isReloadlyConfigured(), name: "Reloadly", url: "TODO-AUTH-URL (per Reloadly docs)", body: { client_id: process.env.RELOADLY_CLIENT_ID, client_secret: process.env.RELOADLY_CLIENT_SECRET, grant_type: "client_credentials" /* TODO: audience */ } });
  token = { value: r.access_token, exp: Date.now() + r.expires_in * 1000 }; return token.value;
}
const call = async <T,>(path: string, body?: unknown) => supplierRequest<T>({ configured: isReloadlyConfigured(), name: "Reloadly", url: `${process.env.RELOADLY_API_BASE}${path}`, headers: { Authorization: `Bearer ${await getToken()}` }, body });
const todo = (what: string): never => { throw new Error(`Reloadly ${what}: endpoint mapping not implemented yet (TODO per Reloadly docs)`); };
export const ReloadlyProvider: TopupProvider = {
  id: "reloadly",
  async getProducts() { await call("/TODO-products"); return todo("getProducts"); },
  async validatePlayer() { return true; }, // code-based delivery: no account to validate
  async createTopup(_i) { await call("/TODO-order", {}); return todo("createTopup"); },
  async getTransactionStatus(_txId) { await call("/TODO-status"); return todo("getTransactionStatus"); },
  async refundTransaction(_txId) { return todo("refundTransaction"); },
  async getBalance() { await call("/TODO-balance"); return todo("getBalance"); },
};
