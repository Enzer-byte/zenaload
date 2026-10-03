import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/adminAuth";
import { UserFacingError } from "@/lib/errors";
import { adminAction } from "@/services/adminService";
const Body = z.object({ action: z.enum(["retry", "review", "refund", "note"]), note: z.string().max(500).optional() });
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const b = Body.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  try { return NextResponse.json(await adminAction((await params).id, b.data.action, b.data.note)); }
  catch (e) { return NextResponse.json({ ok: false, message: e instanceof UserFacingError ? e.message : "Action failed. Check the logs." }, { status: 500 }); }
}
