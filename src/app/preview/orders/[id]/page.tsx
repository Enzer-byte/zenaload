export const dynamic = "force-dynamic";

import { config } from "@/config";
import { StitchOrderStatus } from "@/components/v2/StitchOrderStatus";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Order #${id} — ${config.brand} (Stitch Preview)`,
    description: "Real-time delivery status and receipt for your game top-up.",
  };
}

export default async function PreviewOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StitchOrderStatus id={id} />;
}
