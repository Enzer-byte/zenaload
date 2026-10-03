import { catalogStore } from "@/repositories/catalogStore";
import type { Order } from "@/types";
const mask = (s: string) => (s.length <= 5 ? "****" : s.slice(0, 2) + "*".repeat(s.length - 5) + s.slice(-3));
// The ONLY shape sent to browsers for an order: masked personal data, no gateway/supplier refs, no internal admin notes.
export async function toPublic(o: Order) {
  const [games, products] = await Promise.all([catalogStore.games(), catalogStore.products()]), g = games.find((x) => x.id === o.gameId);
  return {
    id: o.id, gameName: g?.name, gameSlug: g?.slug, productName: products.find((x) => x.id === o.productId)?.name,
    playerFields: Object.fromEntries(Object.entries(o.playerFields).map(([k, v]) => [k, mask(v)])), email: o.customer.email.replace(/^(.).*(@.*)$/, "$1***$2"),
    amount: o.amount, currency: o.currency, payment: o.payment, fulfillment: o.fulfillment, errorMessage: o.errorMessage, createdAt: o.createdAt,
    events: o.events.filter((e) => !e.label.startsWith("Admin note")).map(({ at, label }) => ({ at, label })),
  };
}
export type PublicOrder = Awaited<ReturnType<typeof toPublic>> & { paymentUrl?: string };
