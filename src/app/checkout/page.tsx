export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { catalogStore } from "@/repositories/catalogStore";
import { productService } from "@/services/productService";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: `Checkout — ${config.brand}`,
  description: "Complete your game top-up securely via Paystack.",
};

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const product = sp.product ? await productService.getProduct(sp.product) : null;
  const game =
    product && (await catalogStore.games()).find((g) => g.id === product.gameId);

  if (!product || !game) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-card/60 text-3xl shadow-xl">
          🎮
        </div>
        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Your Order is Empty
        </h1>
        <p className="mt-2 text-sm text-mute leading-relaxed">
          Please select a game credit package and enter your Player ID to proceed to checkout.
        </p>
        <Link
          href="/games"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand2 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 hover:brightness-110 transition active:scale-95"
        >
          <span>Browse Supported Games</span>
          <span>&rarr;</span>
        </Link>
      </div>
    );
  }

  const fields: Record<string, string> = {};
  game.playerFields.forEach((f) => {
    fields[f.key] = sp[`f_${f.key}`] ?? "";
  });

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-mute">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/games" className="hover:text-white transition-colors">
          Games
        </Link>
        <span>/</span>
        <Link href={`/games/${game.slug}`} className="hover:text-white transition-colors">
          {game.name}
        </Link>
        <span>/</span>
        <span className="text-white font-medium">Checkout</span>
      </nav>

      <CheckoutForm
        productId={product.id}
        fields={fields}
        summary={{
          game: game.name,
          product: product.name,
          amount: product.retailPrice,
          originalAmount: product.originalPrice,
          ids: game.playerFields.map((f) => ({
            label: f.label,
            value: fields[f.key] || "—",
          })),
        }}
      />
    </div>
  );
}
