import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";
export const COOKIE = "zl_admin", TTL_MS = 12 * 3600 * 1000;
const ok = (v?: string) => !!v && v.length >= 12 && !v.includes("REPLACE");
export const isAdminConfigured = () => ok(process.env.ADMIN_PASSWORD) && ok(process.env.ADMIN_SESSION_SECRET); // locked until real values are set
const mac = (exp: string) => createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update("zenaload-admin:" + exp).digest("hex");
const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
export const checkPassword = (p: string) => same(p, process.env.ADMIN_PASSWORD ?? "");
export const newToken = () => { const exp = String(Date.now() + TTL_MS); return `${exp}.${mac(exp)}`; };
export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const [exp, sig] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && same(sig, mac(exp));
}
export async function requireAdmin() { if (!(await isAdmin())) redirect("/admin/login"); }
