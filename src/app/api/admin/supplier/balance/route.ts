import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { Shop2topupProvider, isShop2topupConfigured } from "@/lib/providers/topup/shop2topup";
import { MockTopupProvider } from "@/lib/providers/topup/mock";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    if (isShop2topupConfigured()) {
      const balance = await Shop2topupProvider.getBalance();
      return NextResponse.json({
        ok: true,
        balance: typeof balance === "number" && !isNaN(balance) ? balance : 0,
        currency: "USD" as const,
      });
    }

    // Provider is not configured with real credentials; use fallback/mock
    const mockBal = await MockTopupProvider.getBalance().catch(() => 250);
    // In mock mode normalize large mock value to standard balance display ($250.00)
    const balance = mockBal > 10000 ? 250.0 : mockBal;

    return NextResponse.json({
      ok: true,
      balance,
      currency: "USD" as const,
      mock: true,
    });
  } catch (err: unknown) {
    console.warn("[admin/supplier/balance] Error fetching balance:", err);
    return NextResponse.json({
      ok: true,
      balance: 0,
      currency: "USD" as const,
      warning: err instanceof Error ? err.message : "Unable to retrieve balance",
    });
  }
}
