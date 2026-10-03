import type { TopupProvider } from "@/types";
import { NotConfiguredError, SupplierRejectedError } from "@/lib/errors";
import { getTopupProviders } from "@/lib/providers/topup";
type In = Parameters<TopupProvider["createTopup"]>[0];
// Fall back to the next supplier ONLY when the previous one definitively refused (or isn't set up).
// Unknown outcomes (timeout/5xx) are rethrown: the worker retries and status-checks, so we never double-fulfil.
export async function routeTopup(i: In, providers: TopupProvider[] = getTopupProviders()) {
  let last: unknown = new Error("No supplier available");
  for (const p of providers) {
    try { return { provider: p.id, ...(await p.createTopup(i)) }; }
    catch (e) { if (e instanceof SupplierRejectedError || e instanceof NotConfiguredError) { last = e; continue; } throw e; }
  }
  throw last;
}
