import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, limited, record } from "@/lib/rateLimit";
import { createTicket } from "@/services/opsService";
const Body = z.object({ email: z.string().email("Enter a valid email."), orderId: z.string().max(40).optional(), message: z.string().min(10, "Please describe the problem in a few words.").max(1000) });
export async function POST(req: Request) {
  const key = `support:${clientIp(req)}`, W = 3600_000;
  if (limited(key, 5, W)) return NextResponse.json({ error: "Too many requests. Please try again later or use WhatsApp." }, { status: 429 });
  const b = Body.safeParse(await req.json().catch(() => null)); if (!b.success) return NextResponse.json({ error: b.error.issues[0].message }, { status: 400 });
  record(key, W); const t = await createTicket(b.data); return NextResponse.json({ ticketId: t.id });
}
