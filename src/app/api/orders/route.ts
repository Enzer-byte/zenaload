import { NextResponse } from "next/server";
import { z } from "zod";
import { toPublic } from "@/lib/publicOrder";
import { orderService } from "@/services/orderService";
const Body = z.object({
  productId: z.string().min(1),
  playerFields: z.record(z.string(), z.string().min(1, "Field cannot be empty").max(100)),
  customer: z.object({ email: z.string().email("Enter a valid email."), phone: z.string().regex(/^(\+234|0)[789]\d{9}$/, "Enter a valid Nigerian phone number."), whatsapp: z.string().optional() }),
});
export async function POST(req: Request) {
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0].message }, { status: 400 });
  try { { const o = await orderService.create(p.data); return NextResponse.json({ ...(await toPublic(o)), paymentUrl: o.paymentUrl }); } }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong." }, { status: 400 }); }
}
