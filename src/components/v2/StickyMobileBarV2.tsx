import { ngn } from "@/config";
import type { Product } from "@/types";

type PublicProduct = Omit<Product, "supplierCost" | "supplierProductId">;

export interface StickyMobileBarV2Props {
  // Option 1: Direct product object (used in TopupFormV2)
  selectedProduct?: PublicProduct | { name: string; retailPrice: number; originalPrice?: number };
  onBuy?: () => void;

  // Option 2: Individual props (flexible API)
  productName?: string;
  retailPrice?: number;
  originalPrice?: number;
  onTopUpClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  buttonLabel?: string;
}

export function StickyMobileBarV2({
  selectedProduct,
  onBuy,
  productName: propName,
  retailPrice: propRetail,
  originalPrice: propOriginal,
  onTopUpClick,
  disabled = false,
  loading = false,
  buttonLabel = "Top Up Now",
}: StickyMobileBarV2Props) {
  // Resolve values prioritizing direct props or selectedProduct
  const name = propName ?? selectedProduct?.name;
  const retail = propRetail ?? selectedProduct?.retailPrice;
  const original = propOriginal ?? selectedProduct?.originalPrice;
  const clickHandler = onBuy ?? onTopUpClick;

  const discountPercent =
    original && retail && original > retail
      ? Math.round(((original - retail) / original) * 100)
      : null;

  return (
    <aside
      aria-label="Mobile Checkout Actions"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-bg2/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden shadow-2xl shadow-black/80"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Left: Product Info & Pricing */}
        <div className="flex-1 min-w-0">
          {name ? (
            <p className="truncate text-xs font-medium text-ink2">{name}</p>
          ) : (
            <p className="text-xs text-mute">Select denomination</p>
          )}

          <div className="mt-0.5 flex items-baseline gap-2">
            {retail !== undefined ? (
              <>
                <span className="text-base font-bold text-white">{ngn(retail)}</span>
                {original && original > retail && (
                  <span className="text-xs text-mute line-through">
                    {ngn(original)}
                  </span>
                )}
                {discountPercent && (
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-semibold text-emerald-400">
                    -{discountPercent}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-mute">Choose a pack</span>
            )}
          </div>
        </div>

        {/* Right: Primary Checkout CTA */}
        <button
          type="button"
          onClick={clickHandler}
          disabled={disabled || loading || (!selectedProduct && retail === undefined)}
          className="relative inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brand to-brand2 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Processing...</span>
            </span>
          ) : (
            buttonLabel
          )}
        </button>
      </div>
    </aside>
  );
}
