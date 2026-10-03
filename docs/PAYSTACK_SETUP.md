# Paystack: what to fill in once your business account is approved
Everything below is a PLACEHOLDER today. The app runs in `mock` mode by default and real payments stay blocked until you finish this list.
1. **Secret key:** put your `sk_test_...` (then `sk_live_...`) in `.env.local` / Vercel as `PAYSTACK_API_KEY`. The app refuses to call Paystack while it still says `REPLACE_ME`. Server-side only; never commit it.
2. **App URL:** set `NEXT_PUBLIC_APP_URL` to your https domain (Paystack sends customers back to `<url>/orders/<orderId>`).
3. **Webhook URL:** in the Paystack dashboard (Settings > API Keys & Webhooks) set it to `<your domain>/api/webhooks/paystack`. Orders are only fulfilled from this webhook, never from the browser redirect.
4. **Switch on:** set `PAYMENT_PROVIDER=paystack`.
5. **Test:** with test keys, pay with a Paystack test card and confirm the order reaches "Top-Up Successful"; send the webhook twice and confirm only one top-up happens.
6. **Business details to add later:** company name, support WhatsApp number (`NEXT_PUBLIC_WHATSAPP_NUMBER`), support email, Terms, Privacy and Refund policy pages.
