# Connecting Shop2topup and Reloadly

Primary Wholesaler: **Shop2topup** (`https://shop2topup.com/en/reseller-api`)
Adapter: `src/lib/providers/topup/shop2topup.ts`
Fallback Wholesaler: `src/lib/providers/topup/reloadly.ts`

### Setting up Shop2topup (Primary)
1. Add your API credentials to `.env.local`:
   ```env
   TOPUP_PROVIDERS=shop2topup,mock
   SHOP2TOPUP_API_BASE=https://shop2topup.com/api/endpoints/v1
   SHOP2TOPUP_KEY_ID=your_key_id
   SHOP2TOPUP_KEY_SECRET=your_key_secret
   SHOP2TOPUP_WEBHOOK_SECRET=your_webhook_secret
   USD_NGN_RATE=1600
   DEFAULT_MARGIN_PERCENT=10
   ```
2. Log into the Admin panel (`/admin/suppliers/shop2topup`) to check your real-time USD balance and browse live games/products.
3. Use the one-click import tool to add denominations to Zenaload with your desired profit margins.
4. Set your Webhook URL in Shop2topup settings to `https://your-domain.com/api/webhooks/shop2topup`.

### Fallback Supplier: Reloadly
1. Adapter: `src/lib/providers/topup/reloadly.ts`
2. Set `RELOADLY_API_BASE`, `RELOADLY_CLIENT_ID`, and `RELOADLY_CLIENT_SECRET`.
3. Reloadly returns redeemable digital codes: ensure secure storage + order-page display before enabling it.
