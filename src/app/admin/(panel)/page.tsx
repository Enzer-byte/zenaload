import { requireAdmin } from "@/lib/adminAuth";
import { catalogStore } from "@/repositories/catalogStore";
import { orderStore } from "@/repositories/orderStore";
import { opsStore } from "@/repositories/opsStore";
import { Order } from "@/types";
import { ArrowUpRight, ArrowDownRight, Package, AlertCircle, ArrowRight, ExternalLink, Calendar as CalendarIcon, Filter, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();

  const [games, products, orders, tickets, notices] = await Promise.all([
    catalogStore.games(),
    catalogStore.products(),
    orderStore.list(500),
    opsStore.tickets(),
    opsStore.notices(),
  ]);

  const gamesMap = Object.fromEntries(games.map((g) => [g.id, g.name]));

  const cost = (o: Order) =>
    products.find((p) => p.id === o.productId)?.supplierCost ?? 0;

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const paidOrders = orders.filter((o) => o.payment === "PAID");
  const paidToday = todayOrders.filter((o) => o.payment === "PAID");

  const revenueToday = paidToday.reduce((sum, o) => sum + o.amount, 0);
  const costToday = paidToday.reduce((sum, o) => sum + cost(o), 0);
  const marginToday = revenueToday > 0 ? ((revenueToday - costToday) / revenueToday) * 100 : 0;
  
  const aov = paidOrders.length ? paidOrders.reduce((s, o) => s + o.amount, 0) / paidOrders.length : 0;
  const fulfilledOrders = paidOrders.filter(o => o.fulfillment === "SUCCESSFUL");
  const deliveryRate = paidOrders.length ? (fulfilledOrders.length / paidOrders.length) * 100 : 0;

  const pendingReview = orders.filter((o) => o.fulfillment === "PENDING_REVIEW");

  const latestOrders = orders.slice(0, 5).map(o => ({
    id: o.id,
    game: gamesMap[o.gameId] || o.gameId,
    product: products.find(p => p.id === o.productId)?.name || o.productId,
    price: `₦${o.amount.toLocaleString()}`,
    payStatus: o.payment === "PAID" ? "Paid" : o.payment === "PAYMENT_FAILED" ? "Failed" : "Pending",
    fulfillStatus: o.fulfillment === "SUCCESSFUL" ? "Successful" : o.fulfillment === "PROCESSING" ? "Processing" : o.fulfillment === "PENDING_REVIEW" ? "Pending Review" : o.fulfillment === "FAILED" ? "Failed" : "Pending",
    date: new Date(o.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
  }));

  const barData = [
    { day: "Mon", value: 1.1, active: false },
    { day: "Tue", value: 1.3, active: false },
    { day: "Wed", value: 1.0, active: false },
    { day: "Thu", value: 1.5, active: false },
    { day: "Fri", value: 1.2, active: false },
    { day: "Sat", value: 1.845, active: true },
    { day: "Sun", value: 1.4, active: false },
  ];

  return (
    <div className="space-y-6">
      {pendingReview.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between text-sm text-amber-800 shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle size={18} className="text-amber-600" />
            <span>
              <span className="font-bold">⚠️ Attention needed:</span> {pendingReview.length} orders require manual review.
            </span>
          </div>
          <Link href="/admin/orders" className="flex items-center gap-1 font-semibold hover:underline">
            Review stuck orders <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#E0E5F1] rounded-lg p-1 shadow-sm">
            {["Today", "7 Days", "2 Weeks", "1 Month"].map((f) => (
              <button 
                key={f}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  f === "7 Days" 
                    ? 'bg-slate-100 text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E0E5F1] rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
            <Filter size={14} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Revenue Today" 
          value={`₦${revenueToday.toLocaleString()}`}
          trend="+12.5% vs yesterday"
          trendUp={true}
        />
        <KpiCard 
          title="Gross Margin" 
          value={`${marginToday.toFixed(1)}%`}
          trend="+2.1% vs last week"
          trendUp={true}
          icon={<div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Package size={16} /></div>}
        />
        <KpiCard 
          title="Average Order Value" 
          value={`₦${Math.round(aov).toLocaleString()}`}
          trend="-1.2% vs last week"
          trendUp={false}
        />
        <KpiCard 
          title="Delivery Success Rate" 
          value={`${deliveryRate.toFixed(1)}%`}
          trend="+0.4% vs last week"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E0E5F1] shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-semibold text-slate-900">Revenue Performance</h2>
              <div className="text-sm text-slate-500 mt-1">7-day trailing run rate vs target</div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="h-64 flex items-end relative">
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400 pb-8 pointer-events-none">
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-12 text-right">₦2.0M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-12 text-right">₦1.5M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-12 text-right">₦1.0M</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-12 text-right">₦500k</span></div>
              <div className="flex items-center gap-4 w-full border-b border-slate-100 pb-2"><span className="w-12 text-right">0</span></div>
            </div>
            
            <div className="flex-1 flex justify-around items-end h-full pt-4 pb-8 pl-16 relative z-10 group cursor-pointer">
              {barData.map((data, i) => (
                <div key={i} className="flex flex-col items-center w-full relative">
                  {data.active && (
                    <div className="absolute -top-14 bg-white border border-[#E0E5F1] shadow-lg rounded text-xs font-bold py-1 px-2 whitespace-nowrap z-20 text-slate-800 flex flex-col items-center">
                      Today: ₦1,845,200 (Peak)
                      <div className="absolute -bottom-1 w-2 h-2 bg-white border-b border-r border-[#E0E5F1] transform rotate-45"></div>
                    </div>
                  )}
                  <div 
                    className={`w-12 rounded-t-sm transition-all duration-300 ${
                      data.active 
                        ? 'bg-gradient-to-t from-[#1E3BCB] to-[#06B6D4] shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
                    style={{ height: `${(data.value / 2) * 100}%` }}
                  ></div>
                  <div className={`mt-3 text-xs font-medium ${data.active ? 'text-[#1E3BCB]' : 'text-slate-400'}`}>
                    {data.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-white rounded-xl border border-[#E0E5F1] shadow-sm flex-1">
            <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Needs Attention
              </h2>
            </div>
            <div className="divide-y divide-[#E0E5F1]">
              {pendingReview.slice(0, 3).map((o) => (
                <div key={o.id} className="p-4 hover:bg-[#F4F6FB] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="font-medium text-sm">{o.id}</div>
                    </div>
                    <span className="text-xs text-slate-500">Pending Review</span>
                  </div>
                  <div className="text-xs text-slate-600 mb-3 pl-4">
                    Requires manual review.
                  </div>
                  <div className="pl-4">
                    <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-1 text-xs font-semibold text-[#1E3BCB] hover:underline">
                      Review order <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
              {pendingReview.length === 0 && (
                <div className="p-4 text-center text-slate-500 text-sm">
                  All caught up! No orders need attention.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E0E5F1] shadow-sm">
        <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
          <h2 className="font-semibold">Latest Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#1E3BCB] font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F4F6FB] border-b border-[#E0E5F1] text-slate-500 font-semibold">
              <tr>
                <th className="px-5 py-3">ORDER REF</th>
                <th className="px-5 py-3">GAME & PACKAGE</th>
                <th className="px-5 py-3">AMOUNT</th>
                <th className="px-5 py-3">PAYMENT STATUS</th>
                <th className="px-5 py-3">FULFILLMENT STATUS</th>
                <th className="px-5 py-3">TIME</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E5F1]">
              {latestOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors h-[52px]">
                  <td className="px-5 font-medium text-[#1E3BCB]">
                    <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                  </td>
                  <td className="px-5">
                    <div className="font-medium text-slate-900">{order.game}</div>
                    <div className="text-xs text-slate-500">{order.product}</div>
                  </td>
                  <td className="px-5 font-semibold text-slate-900">{order.price}</td>
                  <td className="px-5">
                    <StatusBadge status={order.payStatus} type="payment" />
                  </td>
                  <td className="px-5">
                    <StatusBadge status={order.fulfillStatus} type="fulfillment" />
                  </td>
                  <td className="px-5 text-slate-500 text-xs">{order.date}</td>
                  <td className="px-5 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs font-semibold text-slate-600 border border-slate-200 bg-white px-2 py-1 rounded hover:bg-slate-50">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, trendUp, icon }: { title: string; value: string; trend?: string; trendUp?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#E0E5F1] shadow-sm flex flex-col justify-between">
      <div className="text-sm font-medium text-slate-500 flex items-center justify-between mb-3">
        {title}
        {icon && icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <div className={`mt-2 flex items-center text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, type }: { status: string, type: 'payment' | 'fulfillment' }) {
  let colors = "bg-slate-100 text-slate-600";
  
  if (status === "Paid" || status === "Successful") {
    colors = "bg-emerald-50 text-emerald-700 border border-emerald-200";
  } else if (status === "Processing" || status === "Pending") {
    colors = "bg-blue-50 text-blue-700 border border-blue-200";
  } else if (status === "Pending Review") {
    colors = "bg-amber-50 text-amber-700 border border-amber-200";
  } else if (status === "Failed") {
    colors = "bg-red-50 text-red-700 border border-red-200";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors}`}>
      {status}
    </span>
  );
}
