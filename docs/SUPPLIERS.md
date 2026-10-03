# Connecting Coda and Reloadly (shells are ready, nothing is live)
Adapters: `src/lib/providers/topup/{coda,reloadly}.ts`. Each has TODO markers where the vendor's endpoints, auth and field names go.
1. Fill the PLACEHOLDER env vars in `.env.example` (never commit real values).
2. Implement each `TODO` method from the vendor docs. Use `supplierRequest` so failures are classified: **rejected** (safe to try next supplier) vs **unknown** (timeout/5xx: never fall back, status-check first).
3. Confirm the vendor supports an idempotency key on create-order. If not, you must look up by your order id before every retry.
4. Set `TOPUP_PROVIDERS=coda,reloadly`, fill each product's real `supplierProductId` in admin, then run `TOPUP_PROVIDERS=coda CONTRACT_PLAYER_ID=<sandbox id> CONTRACT_SKU=<sandbox sku> npm run contract` until all PASS.
5. Reloadly returns redeemable codes: add secure storage + order-page display before enabling it.
