export const dynamic = "force-dynamic";

import Link from "next/link";
import { config } from "@/config";
import { OrderStatus } from "@/components/OrderStatus";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Order #${id} — ${config.brand}`,
    description: "Real-time delivery status and receipt for your game top-up.",
  };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="max-w-2xl mx-auto flex items-center gap-2 text-xs text-mute">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/track-order" className="hover:text-white transition-colors">
          Track Order
        </Link>
        <span>/</span>
        <span className="text-white font-mono font-medium">{id}</span>
      </nav>

      <OrderStatus id={id} />
    </div>
  );
}
