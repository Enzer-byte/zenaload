import { NextResponse } from "next/server";
import { toPublic } from "@/lib/publicOrder";
import { orderService } from "@/services/orderService";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const o = await orderService.get((await params).id);
  return o ? NextResponse.json(await toPublic(o)) : NextResponse.json({ error: "Order not found" }, { status: 404 });
}
