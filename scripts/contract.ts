import { getTopupProviders } from "../src/lib/providers/topup";
import type { TopupProvider } from "../src/types";
// Run against a supplier before going live:  TOPUP_PROVIDERS=shop2topup CONTRACT_PLAYER_ID=... CONTRACT_SKU=... npm run contract
const playerId = process.env.CONTRACT_PLAYER_ID ?? "123456789", sku = process.env.CONTRACT_SKU ?? "mock-test", game = process.env.CONTRACT_GAME_ID ?? "free-fire";
export async function runContract(p: TopupProvider) {
  const out: [string, boolean][] = [], t = async (n: string, f: () => Promise<boolean>) => { try { out.push([n, await f()]); } catch (e) { out.push([`${n} (${(e as Error).message})`, false]); } };
  await t("getBalance returns a number", async () => typeof (await p.getBalance()) === "number");
  await t("validatePlayer accepts a real test ID", async () => p.validatePlayer(game, { playerId }));
  await t("validatePlayer rejects garbage", async () => !(await p.validatePlayer(game, { playerId: "abc" })));
  const key = "contract-" + Date.now(); let a = "";
  await t("createTopup returns a transaction id", async () => { const r = await p.createTopup({ idempotencyKey: key, supplierProductId: sku, fields: { playerId } }); a = r.txId; return !!a; });
  await t("same idempotency key returns the SAME transaction (no double top-up)", async () => (await p.createTopup({ idempotencyKey: key, supplierProductId: sku, fields: { playerId } })).txId === a);
  await t("getTransactionStatus works", async () => ["SUCCESSFUL", "PENDING", "FAILED"].includes(await p.getTransactionStatus(a)));
  return out;
}
if (require.main === module) (async () => { const ps = getTopupProviders(); if (!ps.length) { console.log("No configured supplier. Set TOPUP_PROVIDERS and credentials."); process.exit(1); } for (const p of ps) { console.log(`== ${p.id}`); for (const [n, ok] of await runContract(p)) { console.log(ok ? "PASS" : "FAIL", n); if (!ok) process.exitCode = 1; } } })();
