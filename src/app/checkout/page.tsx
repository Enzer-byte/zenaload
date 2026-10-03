import Link from "next/link";
import { catalogStore } from "@/repositories/catalogStore";
import { productService } from "@/services/productService";
import { CheckoutForm } from "@/components/CheckoutForm";
export const metadata = { title: "Checkout" };
export default async function Checkout({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams, product = sp.product ? await productService.getProduct(sp.product) : null, game = product && (await catalogStore.games()).find((g) => g.id === product.gameId);
  if (!product || !game) return (<div><h1 className="text-2xl font-semibold">Your order is empty</h1><p className="my-3 text-ink2">Choose a game and a top-up to get started.</p><Link href="/games" className="inline-block rounded-xl bg-brand px-5 py-3">Browse Games</Link></div>);
  const fields: Record<string, string> = {}; game.playerFields.forEach((f) => (fields[f.key] = sp[`f_${f.key}`] ?? ""));
  return <CheckoutForm productId={product.id} fields={fields} summary={{ game: game.name, product: product.name, amount: product.retailPrice, ids: game.playerFields.map((f) => ({ label: f.label, value: fields[f.key] })) }} />;
}
