# AGENTS.md: Zenaload (Nigerian game top-up platform)

Read this first. It is the single source of truth for any AI coding agent or developer picking up this repo (Antigravity, Cursor, Claude Code, etc.). Keep it updated when you change architecture. Also read `README.md`, `docs/PAYSTACK_SETUP.md`, `docs/SUPPLIERS.md`.

## 1. What this is
**Zenaload** (formerly "GameFuel", only a working name) lets Nigerian gamers buy game credits (Free Fire Diamonds, CODM CP, DLS coins, etc.) in **Naira**, with **guest checkout** (no account), paid via **Paystack** (Flutterwave later), fulfilled automatically through third-party top-up suppliers (**Shop2topup** primary, **Reloadly** fallback).
Core flow: `Home → Game → Top-up → Player ID → Checkout → Pay → Processing → Success → Order tracking`. This flow is the priority; protect it.
Audience: Nigerian students/young adults, mobile-first. Tone: clear, professional, friendly (Nigerian English, no heavy slang). Brand is a premium dark fintech/gaming look, NOT an SMM panel, crypto site or generic SaaS dashboard.
Status: **prototype-complete, not production**. Everything runs on mocks until credentials arrive. Nothing here has handled real money.

## 2. Hard rules (never break)
1. **Never put secrets in the repo.** All keys come from env vars (`.env.example` lists them; placeholders contain `REPLACE_ME`). Server-side secrets must never reach client bundles (no `NEXT_PUBLIC_` on secrets).
2. **An order is only "paid" via `handleChargeSuccess`** (`src/services/paymentEvents.ts`), called by the verified webhook (or the mock gateway). Never mark paid from a browser redirect/query param.
3. **Webhook handling must be idempotent**: signature check on the RAW body (`req.text()`, HMAC-SHA512, constant-time compare), de-dupe by event id, amount check, atomic `claimPaid`, respond 2xx fast, fulfil in the queue.
4. **Never double-fulfil.** Fulfilment uses the order id as the supplier idempotency key, a per-order lock, persists `supplierTxId` immediately after create, and status-checks an existing ref instead of re-creating. Admin retry is guarded the same way.
5. **Supplier failure semantics**: `SupplierRejectedError` (definitive, safe to try next supplier) vs `SupplierUnknownError` (timeout/5xx, NEVER fall back; retry/status-check). Don't weaken `src/lib/supplierRouter.ts`.
6. **Never expose** supplier cost, supplier ids, payment/supplier refs, full email/phone/Player ID, or admin notes to the browser. Customer-facing order data goes through `toPublic()` (`src/lib/publicOrder.ts`). Catalogue reads for customers go through `productService` (strips cost).
7. **Don't fabricate** reviews, customer counts, transaction stats, trust badges, or official game logos/artwork. Use clearly labelled placeholders.
8. **No card data** is ever collected by our UI. Paystack hosted page handles it.
9. Admin routes/APIs must check `requireAdmin()` / `isAdmin()`. Admin stays locked until real `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` are set.
10. **Gift cards are intentionally excluded** (owner's decision). Don't add them unless asked. Flutterwave button is a disabled "coming soon".
11. Keep brand name central: `config.brand` in `src/config/index.ts` (order id prefix `config.orderPrefix` = `ZL`). Don't hard-code "Zenaload" in components.
12. Legal pages are DRAFT templates; do not remove the draft banner or placeholders until the owner supplies details and a Nigerian lawyer reviews.

## 3. Tech stack & commands
Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS 3, `zod` v4 (validation), `postgres` (porsager) for Postgres, `tsx` for scripts. No UI kit installed (shadcn/ui was planned, not added). Node 20+.
```
npm i
cp .env.example .env.local     # then edit
npm run dev                    # http://localhost:3000
npm run typecheck              # tsc --noEmit
npm run check                  # ALL logic tests (scripts/check.ts), no network, in-memory
npm run build                  # production build (must pass)
npm run seed                   # needs DATABASE_URL: loads games+products into Postgres
npm run contract               # supplier sandbox checklist (needs real/sandbox supplier env)
```
Before finishing any change: `npm run typecheck && npm run check && npm run build`. `npm run check` prints PASS/FAIL lines; any FAIL is a regression.
Gotcha: Next 15 route/page `params` and `searchParams` are **Promises** (`await params`). Pages that read the editable catalogue need `export const dynamic = "force-dynamic"` (otherwise stale build-time output).

## 4. Modes (important)
- **Storage**: no `DATABASE_URL` → in-memory stores (data lost on restart, shared via `globalThis`). With `DATABASE_URL` → Postgres repositories. The Postgres code has NEVER been run against a live database. Test it in a Supabase sandbox first.
- **Payments**: `PAYMENT_PROVIDER=mock` (default) simulates a gateway and calls the same webhook handler. `paystack` uses the real provider, which refuses to run while `PAYSTACK_API_KEY` is a placeholder (customer sees "Online payment isn't available yet").
- **Suppliers**: `TOPUP_PROVIDERS=mock` (default; comma list = priority, e.g. `shop2topup,reloadly`). Suppliers with placeholder credentials are skipped. If real suppliers are listed but none are configured, customers get "Top-ups are temporarily unavailable. You have not been charged." and the mock is NOT used silently.

## 5. Architecture map
Layers: **UI (app/, components/) → API routes → services → repositories / providers**. UI never talks to providers or the DB directly.
```
src/config/index.ts        brand, currency, legal placeholders, feature flags, WhatsApp/support (env)
src/types/index.ts         Game, Product, Order, Ticket, Notice + interfaces: PaymentProvider, TopupProvider, OrderStore, CatalogStore, OpsStore
src/data/mock.ts           MOCK catalogue only (seed source). src/data/content.ts = FAQ + steps copy
src/lib/                   orderStateMachine, paystackSignature, queue, supplierRouter, publicOrder,
                           adminAuth, rateLimit, errors, db, useLocal (client localStorage), gamesWithPrices
src/lib/providers/payment  mock.ts, paystack.ts (real calls, placeholder-gated), index.ts (selector)
src/lib/providers/topup    mock.ts, shop2topup.ts + reloadly.ts, http.ts (error classification), index.ts (registry)
src/repositories/          orderStore{,.memory,.pg}, catalogStore{,.memory,.pg}, opsStore, webhookEvents
src/services/              orderService, paymentEvents, fulfilmentWorker, adminService, catalogAdmin, productService,
                           paymentService, topupService, opsService, notificationService (mock)
src/app/                   pages + api (see routes below). src/components/ = UI pieces
supabase/migrations/       001_init.sql (core), 002_ops.sql (tickets, notifications)
scripts/                   check.ts (tests), contract.ts (supplier contract), seed.ts
```
### Routes
Public: `/` `/games` `/games/[slug]` (supports `?pid=` prefill) `/checkout` `/orders/[id]` `/track-order` `/faq` `/how-it-works` `/support` `/terms` `/privacy` `/refund-policy` `/account` (+ `orders`, `player-ids`, `loyalty`, `referrals`).
Admin (cookie session): `/admin/login` then `/admin` (dashboard), `/admin/orders`, `/admin/orders/[id]`, `/admin/products`, `/admin/games`, `/admin/suppliers/shop2topup`, `/admin/notifications`, `/admin/tickets`. Not linked publicly.
API: `POST /api/orders`, `GET /api/orders/[id]` (masked), `POST /api/webhooks/paystack`, `POST /api/webhooks/shop2topup`, `GET /api/search`, `POST /api/support`, `POST /api/admin/login`, `POST /api/admin/orders/[id]`, `POST /api/admin/catalog`, `POST /api/admin/ops`, `POST /api/admin/supplier/shop2topup`.

## 6. Order lifecycle (two independent axes, never merge them)
Payment: `UNPAID → PAYMENT_PENDING → PAID | PAYMENT_FAILED`; `PAID → REFUNDED`; `PAYMENT_FAILED → PAYMENT_PENDING` (retry).
Fulfilment: `NOT_STARTED → PROCESSING → SUCCESSFUL | FAILED | PENDING_REVIEW`; `PENDING_REVIEW → PROCESSING|SUCCESSFUL|FAILED`; `FAILED → PROCESSING` (admin retry only); `SUCCESSFUL` is terminal. `PROCESSING` requires `PAID`. All changes go through `setPayment/setFulfillment` (throws on illegal transitions).
Flow: checkout → `POST /api/orders` (zod-validated) → create order (id `ZL-YYYYMMDD-<8 hex>`), `startPayment` → Paystack returns `redirectUrl` (browser goes to Paystack; Paystack returns to `/orders/<id>`) → Paystack webhook → `handleChargeSuccess` → `claimPaid` → `queue.enqueue("fulfil-order")` → worker (`withLock`, supplier via `routeTopup`, save ref, status) → `SUCCESSFUL` or `PENDING_REVIEW`/`FAILED` + admin notification. Retries: backoff 2s/4s/8s, 4 attempts, then `PENDING_REVIEW` ("Retries exhausted").
Admin actions (`adminService`): Retry (blocked if unpaid/delivered/processing; FAILED clears supplier ref; PENDING_REVIEW status-checks existing ref; needs 2-click confirm in UI), Mark for Review (only PROCESSING), Refund (only PAID + FAILED/PENDING_REVIEW, never delivered), Notes (stored as timeline events prefixed `Admin note:`; hidden from customers).

## 7. Data model (Postgres, see migrations)
`games`, `products` (retail_price, supplier_cost, supplier_product_id, active/featured/popular), `orders` (order_reference unique = the `ZL-…` id; `payment_reference` UNIQUE; payment_status/fulfillment_status enums; wholesale cost snapshot; retry_count), `order_events` (timeline), `webhook_events` (UNIQUE(provider,event_id) = idempotency lock), `support_tickets`, `notifications`. Tables from the original spec NOT yet created: users, order_items, payments, topup_transactions, suppliers, supplier_products, player_accounts, loyalty_*, referrals, admin_users. Orders store the charged amount, so price edits only affect new orders.

## 8. Design system (from the owner's brief)
Tokens live in `tailwind.config.ts`: bg `#080B14`, bg2 `#0D111C`, card `#111827`, elevated `#151B2A`, brand `#6366F1`, brand2 `#7C3AED`, hi `#818CF8`, ink `#F8FAFC`, ink2 `#94A3B8`, mute `#64748B`, line `#1E293B`; success `#22C55E`, warning `#F59E0B`, error `#EF4444`. Use gradients sparingly (hero accent, primary CTA). Avoid neon, glassmorphism, cartoon visuals, heavy animation. Mobile-first; big tap targets; visible focus states; semantic HTML; aria-live for async status. Primary CTA wording: "Top Up Now". **Inter is specified but NOT loaded yet** (use `next/font/google`).

## 9. Testing
`scripts/check.ts` is one file of independent async blocks that share in-memory state and run concurrently (some use `setTimeout` waits ~3.5s). When adding tests, use unique order ids/catalogue ids and don't depend on ordering. Covered: webhook signature, idempotent webhooks, no double fulfil, amount mismatch, admin retry/refund guards, catalogue editing rules, public-order masking, rate limit, supplier router fallback rules, ticket+notification, Paystack request shape (stubbed fetch), supplier contract on mock. NOT covered: Postgres repos, React components, e2e browser flow, accessibility, real Paystack/Shop2topup/Reloadly.

## 10. Known gaps vs the original spec (backlog, roughly by priority)
**Blocked on owner (cannot be done by an agent):** Paystack business approval + keys + webhook URL; Shop2topup API keys; Reloadly sandbox; Supabase project + `DATABASE_URL`; domain + hosting (Vercel); real WhatsApp number/support email; legal details + lawyer review; real game artwork/licences.
**Engineering, can do now:**
1. Replace the in-process queue (`src/lib/queue.ts`, same `register/enqueue` API) with Inngest or BullMQ+Redis so retries survive restarts/serverless. Today background work is `void`-fired and not durable.
2. Run + fix the Postgres repositories against a Supabase sandbox; add integration tests; add missing tables; consider transactions for multi-step writes.
3. Move rate limits (`src/lib/rateLimit.ts`) to Redis/Upstash for multi-instance.
4. Reloadly fallback adapter (follow `docs/SUPPLIERS.md`; confirm idempotency-key support; Reloadly returns codes, so build secure storage + order-page display). Fill real `supplierProductId` per product in admin or import via `/admin/suppliers/shop2topup`.
5. Flutterwave provider (`PaymentProvider` interface) + enable the checkout button.
6. Load Inter via `next/font`; real hero/game artwork; Open Graph images, sitemap, robots; JSON-LD for products.
7. Customer UX gaps vs spec: Player-ID help **modal** with screenshot (currently inline text); sticky mobile checkout CTA/bottom nav; rating/trust info on game page; designed loading/skeleton states on every async path; empty states audit; page transitions (subtle); full accessibility pass (keyboard, contrast, modal focus).
8. Admin gaps: revenue/orders charts, webhook-events panel and supplier balance on order detail, ticket replies by email/WhatsApp, multiple admin users + roles, audit log, product image upload.
9. Real accounts (auth) enabling saved IDs/orders across devices, loyalty and referrals (currently "coming soon" placeholders with no fake data; localStorage keys `zl_orders`, `zl_player_ids`, `zl_recent`).
10. Email/WhatsApp notification providers (`notificationService` is a console mock).
11. Observability: structured logging, error tracking (Sentry), alerting on stuck orders and low supplier balance.
12. Security review before launch: CSRF review of admin APIs, security headers/CSP, dependency audit, secrets rotation plan.

## 11. Go-live checklist
1. Supabase project → apply `001_init.sql`, `002_ops.sql` → set `DATABASE_URL` → `npm run seed` → sandbox-test Postgres repos.
2. Paystack: follow `docs/PAYSTACK_SETUP.md` (test keys first). Webhook URL = `<domain>/api/webhooks/paystack`. Verify: test card pays, order → Successful; replay the webhook, only ONE top-up.
3. Suppliers: get Shop2topup credentials, import products in `/admin/suppliers/shop2topup`, run `npm run contract` until all PASS, set `TOPUP_PROVIDERS`.
4. Kill-worker drill: stop the app mid-fulfilment, restart, confirm exactly one supplier transaction.
5. Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, WhatsApp/support env; fill `legal` config, finish legal pages, `legal.isDraft=false`.
6. Decide catalogue at launch (see §12), real supplier SKUs, pricing/margins.
7. Pilot with real ₦500–1,000 orders, watch `/admin/notifications` and orders daily.

## 12. Decisions & context
- **Launch catalogue**: the supplier roadmap recommends launching with Free Fire and CODM and EXCLUDING eFootball (reseller supply relied on credential-sharing that violates publisher terms and risks bans). The mock catalogue still includes eFootball (the original brief did). Owner must decide; the admin can hide it (`Games → Hidden`) or set `active:false` in seed.
- Wholesale suppliers: Shop2topup (primary, official reseller API, validates Player IDs), Reloadly (fallback, codes). Gray-market suppliers are prohibited.
- Naira amounts are integers in ₦ (Paystack gets kobo = ×100). Phone format: `+234` or `0` + `[789]` + 9 digits. Player ID: 6–12 digits (mock rule; per-game patterns live in `Game.playerFields`).
- `config.topupProvider` and `.env` `PAYMENT_PROVIDER` naming: payment selection is `PAYMENT_PROVIDER`; supplier selection is `TOPUP_PROVIDERS`.
- A separate clickable HTML prototype (single file, mock data, same brand) exists outside this repo: https://claude.ai/artifact/XH52YRnVXhEnCYZq39afgA. It is a design reference; it has a few demo-only features (outcome simulator, charts) the Next.js app lacks, and the app has real backend pieces the prototype lacks.
- Out of scope (do not build yet): native app, community/tournaments, creator marketplace, SMM features, crypto payments, subscriptions, AI features, physical goods, multi-currency, gift cards.

## 13. How to work in this repo (agent etiquette)
- Make small, verified changes; run the three verification commands; add/extend tests in `scripts/check.ts` for logic changes.
- Prefer extending interfaces (`PaymentProvider`, `TopupProvider`, `*Store`) over branching in services/UI.
- Customer-facing error messages must be understandable and reassuring (e.g. "Your payment has not been lost"); throw `UserFacingError` for messages safe to show; log the rest.
- Keep comments for the *why* (safety rationale), mark integration points `TODO(<vendor>)`, and update this file when behaviour or architecture changes.
- If something here conflicts with the owner's latest instruction, the owner wins; then update this file.
