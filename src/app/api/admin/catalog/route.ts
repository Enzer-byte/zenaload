import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { CatalogActionSchema, catalogAdmin } from "@/services/catalogAdmin";
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Not signed in." }, { status: 401 });
  const b = CatalogActionSchema.safeParse(await req.json().catch(() => null));
  if (!b.success) return NextResponse.json({ ok: false, message: b.error.issues[0].message }, { status: 400 });
  return NextResponse.json(await catalogAdmin(b.data));
}
