"use client";

import { ArrowUpRight, ArrowDownRight, Package, AlertCircle, ArrowRight, ExternalLink, Calendar as CalendarIcon, Filter, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState("7 Days");

  const filters = ["Today", "7 Days", "2 Weeks", "1 Month"];
  
  const barData = [
    { day: "Mon", value: 1.1, active: false },
    { day: "Tue", value: 1.3, active: false },
    { day: "Wed", value: 1.0, active: false },
    { day: "Thu", value: 1.5, active: false },
    { day: "Fri", value: 1.2, active: false },
    { day: "Sat", value: 1.845, active: true },
    { day: "Sun", value: 1.4, active: false },
  ];

  const mockOrders = [
    { id: "ZL-20231015-8A2F", game: "Free Fire", product: "100 Diamonds", price: "₦1,500", payStatus: "Paid", fulfillStatus: "Successful", date: "Oct 15, 14:32" },
    { id: "ZL-20231015-9B3C", game: "CODM", product: "80 CP", price: "₦2,000", payStatus: "Paid", fulfillStatus: "Processing", date: "Oct 15, 14:30" },
    { id: "ZL-20231015-7C1D", game: "PUBG Mobile", product: "60 UC", price: "₦1,200", payStatus: "Paid", fulfillStatus: "Pending Review", date: "Oct 15, 14:15" },
    { id: "ZL-20231015-5E4F", game: "Free Fire", product: "310 Diamonds", price: "₦4,500", payStatus: "Failed", fulfillStatus: "Failed", date: "Oct 15, 13:45" },
  ];

  return (
    <div className="space-y-6">
      {/* Attention Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between text-sm text-amber-800 shadow-sm">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle size={18} className="text-amber-600" />
          <span>
            <span className="font-bold">⚠️ Attention needed:</span> 2 orders require manual review due to supplier timeout. Shop2topup balance is healthy (₦642,800).
          </span>
        </div>
        <button className="flex items-center gap-1 font-semibold hover:underline">
          Review stuck orders <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#E0E5F1] rounded-lg p-1 shadow-sm">
            {filters.map((f) => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeFilter === f ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-6 bg-[#E0E5F1] mx-1 self-center"></div>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-md flex items-center gap-2">
              <CalendarIcon size={14} />
              Date Range
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard 
          title="Revenue (Today)" 
          value="₦1,845,200" 
          trend="+16.2% vs yesterday" 
          trendUp={true}
          icon={<ExternalLink className="text-slate-400 cursor-pointer hover:text-slate-600" size={16} />}
        />
        <KpiCard 
          title="Estimated Gross Margin" 
          value="18.4%" 
          trend="+0.8% | ₦339,516 profit" 
          trendUp={true} 
        />
        <KpiCard 
          title="Average Order Value" 
          value="₦2,450" 
          trend="-1.5% vs yesterday" 
          trendUp={false} 
        />
        <KpiCard 
          title="Delivery Success Rate" 
          value="98.6%" 
          trend="+0.4% | 742/753 delivered" 
          trendUp={true} 
        />
      </div>

      {/* Side-by-Side Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Revenue Performance Bar Chart (60% width roughly, col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-[#E0E5F1] shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg">Revenue Performance</h2>
              <div className="text-sm text-slate-500 mt-1">Average 7-day run rate: <span className="font-medium text-slate-700">₦1,524,800/day</span> <span className="text-emerald-600 font-medium">(+21.4% WoW)</span></div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 mt-8 relative">
            {/* Y-axis grid lines (mock) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[2, 1.5, 1, 0.5, 0].map(val => (
                <div key={val} className="w-full border-t border-slate-100 flex items-center h-0 relative">
                  <span className="absolute -left-2 -translate-x-full text-xs text-slate-400">
                    {val === 0 ? '0' : `₦${val}M`}
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="w-full h-[200px] flex items-end justify-between pl-10 pr-2 pb-6 pt-2 z-10 relative">
              {barData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center group relative h-full justify-end w-1/8">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20">
                    ₦{data.value.toFixed(1)}M
                  </div>
                  
                  {/* Active Badge */}
                  {data.active && (
                    <div className="absolute -top-14 bg-white border border-[#E0E5F1] shadow-lg rounded text-xs font-bold py-1 px-2 whitespace-nowrap z-20 text-slate-800 flex flex-col items-center">
                      Today: ₦1,845,200 (Peak)
                      <div className="absolute -bottom-1 w-2 h-2 bg-white border-b border-r border-[#E0E5F1] transform rotate-45"></div>
                    </div>
                  )}

                  {/* Bar */}
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

        {/* Right: Needs Attention & Supplier Balance */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-white rounded-xl border border-[#E0E5F1] shadow-sm flex-1">
            <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Needs Attention
              </h2>
            </div>
            <div className="divide-y divide-[#E0E5F1]">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 hover:bg-[#F4F6FB] transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="font-medium text-sm">ZL-20261005-B9F4E1</div>
                    </div>
                    <span className="text-xs text-slate-500">45m ago</span>
                  </div>
                  <div className="text-xs text-slate-600 mb-3 pl-4">
                    Supplier Gateway Timeout. Order is stuck in Pending Review.
                  </div>
                  <div className="pl-4">
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#1E3BCB] hover:underline">
                      Review order <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-4 hover:bg-[#F4F6FB] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <div className="font-medium text-sm">Shop2topup Balance</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 mb-2 pl-4">
                  Current balance is ₦642,800. Expected to last ~3 days at current run rate.
                </div>
                <div className="pl-4 w-full bg-[#E0E5F1] rounded-full h-1.5 mb-1 mt-3">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders Live Table */}
      <div className="bg-white rounded-xl border border-[#E0E5F1] shadow-sm">
        <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between">
          <h2 className="font-semibold">Latest Orders</h2>
          <Link href="/preview/admin/orders" className="text-sm text-[#1E3BCB] font-medium hover:underline">
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
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors h-[52px]">
                  <td className="px-5 font-medium text-[#1E3BCB]">
                    <Link href={`/preview/admin/orders`}>{order.id}</Link>
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
                    <Link href={`/preview/admin/orders`} className="text-xs font-semibold text-slate-600 border border-slate-200 bg-white px-2 py-1 rounded hover:bg-slate-50">
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
