import { NotConfiguredError, SupplierRejectedError, SupplierUnknownError } from "@/lib/errors";
export const real = (v?: string) => !!v && v.length >= 8 && !v.includes("REPLACE");
// Shared HTTP wrapper so every supplier classifies failures the same way (this drives safe fallback behaviour).
export async function supplierRequest<T = unknown>(o: { configured: boolean; name: string; url: string; method?: "GET" | "POST"; headers?: Record<string, string>; body?: unknown }): Promise<T> {
  if (!o.configured) throw new NotConfiguredError(`${o.name} credentials are still placeholders (see docs/SUPPLIERS.md)`);
  let res: Response;
  try { res = await fetch(o.url, { method: o.method ?? (o.body ? "POST" : "GET"), headers: { "Content-Type": "application/json", ...o.headers }, body: o.body ? JSON.stringify(o.body) : undefined, signal: AbortSignal.timeout(15_000) }); }
  catch { throw new SupplierUnknownError(`${o.name} did not respond`); } // timeout/network: may or may not have been processed
  if (res.status >= 500 || res.status === 429 || res.status === 408) throw new SupplierUnknownError(`${o.name} error ${res.status}`);
  if (res.status >= 400) throw new SupplierRejectedError(`${o.name} rejected the request (${res.status})`);
  return (await res.json()) as T;
}
