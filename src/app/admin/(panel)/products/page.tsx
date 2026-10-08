import { ProductsEditor } from "@/components/CatalogEditor";
import { catalogStore } from "@/repositories/catalogStore";

export const dynamic = "force-dynamic";

export default async function Products() {
  const [games, products] = await Promise.all([catalogStore.games(), catalogStore.products()]);
  return (
    <>
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">Products</h1>
      <p className="mb-6 text-sm text-slate-500">Price changes apply to new orders only. Supplier cost is never shown to customers.</p>
      <ProductsEditor games={games} products={products} />
    </>
  );
}
