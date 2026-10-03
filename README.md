# Zenaload (working name) — Next.js scaffold

> AI agents / new developers: read `AGENTS.md` first.
Structure: `config/` (brand, flags) · `types/` · `data/mock.ts` · `services/*` (product, order, payment, topup, notification) · `lib/providers/{payment,topup}` (Mock now; Paystack stub) · `lib/orderStateMachine.ts` · `app/api/*` · `components/`.
Run: `npm i && cp .env.example .env.local && npm run dev`
Swap providers: implement `PaystackProvider` / real `TopupProvider`, set `PAYMENT_PROVIDER` / `TOPUP_PROVIDER`. UI never changes.
Notes: orders live in memory (dev only); production needs Postgres + webhook-driven fulfilment (serverless can't run the background `process()` after responding).
TODO: /checkout step, /account/*, /admin/* (see the HTML prototype for the designs to port), shadcn/ui, FAQ, How It Works pages.

## Payments safety (implemented)
Webhook: raw-body HMAC-SHA512 check, event de-dup (`webhook_events` unique key), amount check, `handleChargeSuccess` is the only path to PAID, fulfilment runs in a queued worker with backoff, row-lock + idempotency key + status-check-before-create to prevent double top-ups. Schema: `supabase/migrations/001_init.sql`. Verify: `npm run check`.
TODO: swap in-memory repositories for Postgres, queue for Inngest/BullMQ, add Coda/Reloadly adapters, Paystack initialize/verify.

## Database (Supabase/Postgres)
1. Apply `supabase/migrations/001_init.sql`  2. Put `DATABASE_URL` in `.env.local`  3. `npm run seed`  4. `npm run dev`
With `DATABASE_URL` unset everything runs in memory. Repositories: `src/repositories/orderStore.{memory,pg}.ts`, `webhookEvents.ts`. Paid transition is one conditional UPDATE; workers use a Postgres advisory lock per order.
Untested against a live database; run a sandbox pass (duplicate webhooks, killed worker mid-fulfilment) before real money.

## Admin (/admin)
Locked until you set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (placeholders in `.env.example`). Dashboard, orders (filters + search), order detail with Retry / Mark for Review / Refund / notes, read-only products. Not linked from the public site. TODO: IP rate-limit on login, editable products/games, multiple admin users.

## Catalogue editing (/admin/products, /admin/games)
Edit prices/supplier cost (margin shown live), enable/disable, featured/popular flags, game order; add games (hidden until they have an active denomination) and denominations. Catalogue reads/writes go through `repositories/catalogStore.{memory,pg}.ts`; with `DATABASE_URL` set, run `npm run seed` once, then edits persist. Price edits only affect new orders. Supplier SKUs on new denominations are placeholders until Coda/Reloadly are connected.

## Customer pages
/faq (with FAQ schema), /how-it-works, search modal (nav), guest account at /account (orders, saved Player IDs on this device; rewards/referrals are "coming soon" placeholders with no fake data). Orders returned to browsers are masked (email, phone, Player ID; no gateway/supplier refs; admin notes hidden). Order IDs use 8 random hex chars so they can't be guessed.

## Ops
Admin login: 5 failed attempts per IP locks it for 15 min (in-memory; use Redis/Upstash on serverless). Support: /support form creates tickets; admin gets notifications for new tickets, delayed/failed top-ups. Supplier shells: see docs/SUPPLIERS.md. Run `npm run check` (all logic) and `npm run contract` (supplier sandbox).

## Legal pages
/terms, /privacy, /refund-policy are DRAFT templates. Fill `legal` in `src/config/index.ts` (company name, RC number, address, dates, refund days, court city), resolve every [BRACKETED] item in the three pages, get a Nigerian lawyer to review, then set `legal.isDraft = false`. Checkout links to all three.
