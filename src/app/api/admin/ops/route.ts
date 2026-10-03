import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/adminAuth";
import { opsStore } from "@/repositories/opsStore";
const Body = z.object({ action: z.enum(["readAll", "resolve", "reopen"]), id: z.string().optional() });
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const b = Body.safeParse(await req.json().catch(() => null)); if (!b.success) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  if (b.data.action === "readAll") await opsStore.readAll(); else if (b.data.id) await opsStore.setTicketOpen(b.data.id, b.data.action === "reopen"); else return NextResponse.json({ ok: false, message: "Missing id." }, { status: 400 });
  return NextResponse.json({ ok: true, message: "Done." });
}
