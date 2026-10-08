import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Undo, Eye, FileText, Lock } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Mock data for the specific order
  const { id } = await params;
  const orderId = id;
  const isPendingReview = orderId.includes("7C1D"); // Just a mock condition for UI
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/preview/admin/orders" className="p-2 bg-white border border-[#E0E5F1] rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{orderId}</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <span>Oct 15, 2023, 14:15:22 WAT</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#0F8A4A] bg-[#E3F6EA] px-2 py-0.5 rounded text-xs font-semibold">
              Paid via Paystack
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-[#E0E5F1] pb-2">Order Information</h2>
            
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Game</div>
                <div className="font-medium flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-200 rounded flex-shrink-0"></div>
                  Free Fire
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Product</div>
                <div className="font-medium">100 Diamonds</div>
              </div>
              
              <div>
                <div className="text-slate-500 mb-1">Player ID</div>
                <div className="font-medium flex items-center gap-2">
                  1234567890 
                  <button className="text-slate-400 hover:text-[#2D5BFF]" title="Verify ID"><CheckCircle2 size={14}/></button>
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Customer Mask Check</div>
                <div className="font-medium flex items-center gap-1 text-slate-700">
                  <Lock size={14} className="text-emerald-500" /> Masked (safe for public)
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-[#F4F6FB] rounded-lg p-4 grid grid-cols-2 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Amount Charged</div>
                <div className="font-bold text-lg">₦1,500.00</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Supplier Cost</div>
                <div className="font-semibold text-slate-700">₦1,350.00 (Shop2topup)</div>
                <div className="text-xs text-emerald-600 font-medium">Margin: ₦150.00 (10%)</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FileText size={18} />
              Event Timeline
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E0E5F1] before:to-transparent">
              <TimelineItem 
                time="14:15:22" 
                title="Order Created" 
                desc="Checkout initiated by guest" 
                icon={<div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>} 
              />
              <TimelineItem 
                time="14:16:05" 
                title="Payment Successful" 
                desc="Paystack ref: T123456789" 
                icon={<div className="w-2.5 h-2.5 bg-[#0F8A4A] rounded-full"></div>} 
              />
              <TimelineItem 
                time="14:16:06" 
                title="Fulfillment Started" 
                desc="Sent to Shop2topup" 
                icon={<div className="w-2.5 h-2.5 bg-[#2D5BFF] rounded-full"></div>} 
              />
              {isPendingReview ? (
                <TimelineItem 
                  time="14:16:45" 
                  title="Fulfillment Failed" 
                  desc="Supplier error: Timeout. Retries exhausted." 
                  icon={<div className="w-2.5 h-2.5 bg-[#B26A00] rounded-full"></div>} 
                  isError 
                />
              ) : (
                <TimelineItem 
                  time="14:16:15" 
                  title="Fulfillment Successful" 
                  desc="Supplier ref: S987654321" 
                  icon={<div className="w-2.5 h-2.5 bg-[#0F8A4A] rounded-full"></div>} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-2">Actions</h3>
            
            <button className="w-full flex items-center justify-center gap-2 bg-[#1E3BCB] hover:bg-[#18246B] text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50">
              <RefreshCw size={16} />
              Retry Fulfillment
            </button>
            
            {isPendingReview && (
              <button className="w-full flex items-center justify-center gap-2 bg-[#FFF1D6] hover:bg-[#FFE4B2] text-[#B26A00] py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Eye size={16} />
                Mark as Reviewing
              </button>
            )}
            
            <div className="pt-3 mt-3 border-t border-[#E0E5F1]">
              <button className="w-full flex items-center justify-center gap-2 border border-[#FCE5E5] bg-[#FCE5E5]/50 hover:bg-[#FCE5E5] text-[#C93535] py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Undo size={16} />
                Refund Order
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-3">Admin Notes</h3>
            <textarea 
              className="w-full bg-[#F4F6FB] border border-[#E0E5F1] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB] min-h-[100px] resize-none"
              placeholder="Add internal note..."
            ></textarea>
            <button className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ time, title, desc, icon, isError = false }: { time: string; title: string; desc: string; icon?: React.ReactNode; isError?: boolean }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
        {icon}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#E0E5F1] bg-white shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-semibold text-sm ${isError ? 'text-[#C93535]' : ''}`}>{title}</h4>
          <time className="text-xs text-slate-500 font-medium">{time}</time>
        </div>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}
