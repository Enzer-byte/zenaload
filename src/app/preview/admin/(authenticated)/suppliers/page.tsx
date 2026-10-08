import { Server, Activity, ArrowRightLeft, DollarSign, Download, CheckCircle2, AlertCircle } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suppliers & Gateways</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor supplier balances and API health.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          <Activity size={16} />
          View Logs
        </button>
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
              <span className="font-bold text-xl text-[#0F8A4A]">₦450,200.00</span>
            </div>
          </div>
          
          <div className="p-5 space-y-4 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">API Health</span>
              <span className="font-medium flex items-center gap-1 text-[#0F8A4A]">
                <div className="w-2 h-2 rounded-full bg-[#0F8A4A]"></div>
                99.9% Uptime (94ms)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Orders Today</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Failed Topups (24h)</span>
              <span className="font-medium text-[#B26A00]">3</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-[#E0E5F1] bg-[#F4F6FB] flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E0E5F1] hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
              <Download size={16} />
              Sync Products
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E0E5F1] hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
              <DollarSign size={16} />
              Topup Wallet
            </button>
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
              <span className="text-xs text-slate-500 mb-1">Current Balance</span>
              <span className="font-bold text-xl text-[#2D5BFF]">₦120,500.00</span>
            </div>
          </div>
          
          <div className="p-5 space-y-4 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">API Health</span>
              <span className="font-medium flex items-center gap-1 text-[#0F8A4A]">
                <div className="w-2 h-2 rounded-full bg-[#0F8A4A]"></div>
                100% Uptime (112ms)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Orders Today</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Failed Topups (24h)</span>
              <span className="font-medium">0</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-[#E0E5F1] bg-[#F4F6FB] flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E0E5F1] hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
              <Download size={16} />
              Sync Products
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E0E5F1] hover:bg-slate-50 py-2 rounded-lg text-sm font-medium transition-colors">
              <DollarSign size={16} />
              Topup Wallet
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
          <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-500 mb-1">Success Rate</div>
              <div className="font-bold text-lg">94.2%</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Avg Process Time</div>
              <div className="font-bold text-lg">1.2s</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Active Webhooks</div>
              <div className="font-bold text-lg text-[#0F8A4A]">Connected</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Webhook Errors</div>
              <div className="font-bold text-lg flex items-center gap-1">
                0 <span className="text-xs font-normal text-slate-400">last 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
