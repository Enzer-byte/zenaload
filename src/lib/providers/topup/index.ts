import type { TopupProvider } from "@/types";
import { UserFacingError } from "@/lib/errors";
import { MockTopupProvider } from "./mock";
import { ReloadlyProvider, isReloadlyConfigured } from "./reloadly";
import { Shop2topupProvider, isShop2topupConfigured } from "./shop2topup";
const REG: Record<string, { p: TopupProvider; ok: () => boolean }> = {
  mock: { p: MockTopupProvider, ok: () => true },
  shop2topup: { p: Shop2topupProvider, ok: isShop2topupConfigured },
  reloadly: { p: ReloadlyProvider, ok: isReloadlyConfigured },
};
// TOPUP_PROVIDERS="shop2topup,mock" = priority order. Unconfigured (placeholder) suppliers are skipped. Default: mock (dev only).
export const getTopupProviders = (): TopupProvider[] => (process.env.TOPUP_PROVIDERS ?? "mock").split(",").map((s) => s.trim()).filter((k) => REG[k]?.ok()).map((k) => REG[k].p);
export const getTopupProvider = (_supplierId?: string): TopupProvider => {
  const p = getTopupProviders()[0]; // never silently fall back to the mock when real suppliers are listed but not ready
  if (!p) throw new UserFacingError("Top-ups are temporarily unavailable. You have not been charged.");
  return p;
};
