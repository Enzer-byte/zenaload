import { NextResponse } from "next/server";
import { clearLimit, clientIp, limited, record } from "@/lib/rateLimit";
import { COOKIE, TTL_MS, checkPassword, isAdminConfigured, newToken } from "@/lib/adminAuth";
export async function POST(req: Request) {
  if (!isAdminConfigured()) return NextResponse.json({ error: "Admin access isn't configured yet (set ADMIN_PASSWORD and ADMIN_SESSION_SECRET)." }, { status: 503 });
  const key = `login:${clientIp(req)}`, W = 15 * 60_000;
  if (limited(key, 5, W)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !checkPassword(password)) { record(key, W); await new Promise((r) => setTimeout(r, 800)); return NextResponse.json({ error: "Incorrect password." }, { status: 401 }); } // TODO: rate-limit by IP in production
  clearLimit(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, newToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL_MS / 1000 });
  return res;
}
