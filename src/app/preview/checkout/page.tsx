export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { catalogStore } from "@/repositories/catalogStore";
import { productService } from "@/services/productService";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = {
  title: `Direct Guest Checkout — ${config.brand} (Stitch Preview)`,
  description: "Complete your game top-up securely via Paystack.",
};

export default async function PreviewCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const product = sp.product ? await productService.getProduct(sp.product) : null;
  const game =
    product && (await catalogStore.games()).find((g) => g.id === product.gameId);

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-12 py-4 md:py-8">
      {/* Breadcrumb Path verbatim from Stitch 74eb73d961c941c5ad96ef66675b704a.html */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-outline mb-4 text-xs overflow-x-auto whitespace-nowrap py-1">
        <Link href="/preview" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Home</span>
        </Link>
        <span className="text-outline-variant">/</span>
        <Link href="/preview/games" className="hover:text-primary transition-colors">
          {game ? game.name : "Games"}
        </Link>
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface font-bold">Checkout</span>
      </nav>

      {/* Page Title & Micro Status verbatim from Stitch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-surface-variant gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Direct Guest Checkout
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-0.5">
            Zero account registration needed. Powered by instant bank-grade settlement.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-variant">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
          <span className="text-xs text-on-surface-variant">
            Direct API Connection: <strong className="text-primary font-bold">Live (~24s avg)</strong>
          </span>
        </div>
      </div>

      {!product || !game ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 sm:p-12 text-center border border-surface-variant card-elevation-1 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto text-3xl">
            🎮
          </div>
          <h2 className="text-lg font-bold text-on-surface">No Top-Up Package Selected</h2>
          <p className="text-xs text-outline">
            Please pick a supported game and select your diamond or credit package first.
          </p>
          <div className="pt-2">
            <Link
              href="/preview/games"
              className="px-6 py-3 rounded-xl bg-electric-gradient text-white text-xs font-bold brand-glow shadow-md inline-block active:scale-95 transition-transform"
            >
              Browse Supported Games &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <CheckoutForm
          productId={product.id}
          fields={Object.fromEntries(
            game.playerFields.map((f) => [f.key, sp[`f_${f.key}`] ?? ""])
          )}
          summary={{
            game: game.name,
            product: product.name,
            amount: product.retailPrice,
            originalAmount: product.originalPrice,
            ids: game.playerFields.map((f) => ({
              label: f.label,
              value: sp[`f_${f.key}`] || "—",
            })),
          }}
        />
      )}
    </div>
  );
}
