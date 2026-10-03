// Single source of truth. Rename the brand here only.
export const config = {
  brand: "Zenaload",
  orderPrefix: "ZL",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  currency: "NGN" as const,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com",
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "mock",
  topupProvider: process.env.TOPUP_PROVIDER ?? "mock",
  // PLACEHOLDERS: fill these in, then set isDraft to false (hides the "draft" banner on legal pages).
  legal: { isDraft: true, companyName: "[COMPANY LEGAL NAME]", rcNumber: "[CAC RC NUMBER]", address: "[REGISTERED ADDRESS]", effectiveDate: "[EFFECTIVE DATE]", refundDays: "[X]", courtCity: "[CITY, e.g. Lagos]" },
  features: { accounts: false, loyalty: false, referrals: false, giftCards: false },
};
export const ngn = (n: number) => "₦" + n.toLocaleString("en-NG");
