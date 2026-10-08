import { Server, Activity, ArrowRightLeft, DollarSign, Download, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { isShop2topupConfigured, Shop2topupProvider } from "@/lib/providers/topup/shop2topup";
import { isReloadlyConfigured } from "@/lib/providers/topup/reloadly";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const shop2topupConfigured = isShop2topupConfigured();
  let shop2topupBalance = 0;
  let shop2topupError = "";

  if (shop2topupConfigured) {
    try {
      shop2topupBalance = await Shop2topupProvider.getBalance();
    } catch (e: any) {
      shop2topupError = e.message || "Failed to fetch balance";
    }
  }

  const reloadlyConfigured = isReloadlyConfigured();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers & Gateways</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor supplier balances and API health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shop2topup */}
        <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E6ECFF] rounded-lg flex items-center justify-center text-[#2D5BFF]">
                <Server size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Shop2topup</h2>
                <div className="flex items-center gap-1 text-xs font-medium text-[#0F8A4A]">
                  <CheckCircle2 size={12} />
                  Primary Supplier
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 mb-1">Current Balance</span>
              <span className="font-bold text-xl text-[#0F8A4A]">
                {shop2topupConfigured ? (shop2topupError ? "Error" : `₦${shop2topupBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`) : "Not Configured"}
              </span>
            </div>
          </div>
          
          <div className="p-5 space-y-4 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">API Health</span>
              {shop2topupConfigured ? (
                <span className="font-medium flex items-center gap-1 text-[#0F8A4A]">
                  <div className="w-2 h-2 rounded-full bg-[#0F8A4A]"></div>
                  Connected
                </span>
              ) : (
                <span className="font-medium flex items-center gap-1 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  Pending Credentials
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Orders Today</span>
              <span className="font-medium">-</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-[#E0E5F1] bg-[#F4F6FB] flex gap-3">
            <Link 
              href="/admin/suppliers/shop2topup" 
              className="flex-1 flex items-center justify-center gap-2 bg-[#1E3BCB] text-white hover:bg-[#18246B] py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Download size={16} />
              Sync Products & Catalogue
            </Link>
            <a 
              href="https://shop2topup.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 bg-white border border-[#E0E5F1] hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700"
            >
              <DollarSign size={16} />
              Shop2topup Portal
            </a>
          </div>
        </div>

        {/* Reloadly */}
        <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <Server size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Reloadly</h2>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <ArrowRightLeft size={12} />
                  Fallback Supplier
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 mb-1">Status</span>
              <span className="font-bold text-sm text-slate-600">
                {reloadlyConfigured ? "Connected" : "No backup configured"}
              </span>
            </div>
          </div>
          
          <div className="p-5 space-y-4 flex-1 flex flex-col items-center justify-center text-center">
            {reloadlyConfigured ? (
               <div className="text-sm text-slate-500">Reloadly is configured as the fallback supplier.</div>
            ) : (
               <div className="text-sm text-slate-500">No backup configured (Add backup supplier)</div>
            )}
          </div>
          
          <div className="p-4 border-t border-[#E0E5F1] bg-[#F4F6FB] flex gap-3">
            <button disabled className="opacity-50 cursor-not-allowed flex-1 flex items-center justify-center gap-2 bg-white border border-[#E0E5F1] hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
              <AlertCircle size={16} />
              Coming Soon
            </button>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm overflow-hidden md:col-span-2">
          <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E3F6EA] rounded-lg flex items-center justify-center text-[#0F8A4A]">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Paystack Gateway</h2>
                <div className="text-xs text-slate-500">Payment Processor</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#E3F6EA] text-[#0F8A4A] px-3 py-1 rounded-full text-sm font-semibold">
              <CheckCircle2 size={16} />
              Operational
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500 mb-1">Webhook URL (Configure in Paystack Dashboard)</div>
              <code className="font-mono text-xs bg-slate-100 px-2 py-1 rounded select-all break-all block w-full">
                {process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"}/api/webhooks/paystack
              </code>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Active Webhooks</div>
              <div className="font-bold text-lg text-[#0F8A4A]">Listening</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
