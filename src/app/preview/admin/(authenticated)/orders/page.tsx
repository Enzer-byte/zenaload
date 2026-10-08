"use client";

import { Search, Filter, MoreHorizontal, Copy, X, ArrowRight, CornerDownRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

type Order = {
  id: string;
  game: string;
  product: string;
  price: string;
  payStatus: string;
  fulfillStatus: string;
  date: string;
  customer: string;
  email: string;
  supplier: string;
  playerId: string;
  cost: string;
  margin: string;
};

export default function OrdersPage() {
  const mockOrders: Order[] = [
    { id: "ZL-20261005-B9F4E1", game: "Free Fire", product: "100 Diamonds", price: "₦1,500", payStatus: "Paid", fulfillStatus: "Pending Review", date: "Oct 5, 14:32", customer: "Michael K.", email: "michael@example.com", supplier: "Shop2topup", playerId: "948273645", cost: "₦1,250", margin: "₦250 (16.7%)" },
    { id: "ZL-20231015-9B3C", game: "CODM", product: "80 CP", price: "₦2,000", payStatus: "Paid", fulfillStatus: "Processing", date: "Oct 15, 14:30", customer: "Sarah J.", email: "sarah@example.com", supplier: "Reloadly", playerId: "8394857610", cost: "₦1,600", margin: "₦400 (20.0%)" },
    { id: "ZL-20261005-A1B2C3", game: "PUBG Mobile", product: "325 UC", price: "₦5,800", payStatus: "Paid", fulfillStatus: "Successful", date: "Oct 5, 12:15", customer: "David O.", email: "david.o@example.com", supplier: "Shop2topup", playerId: "5182930495", cost: "₦4,750", margin: "₦1,050 (18.1%)" },
    { id: "ZL-20231015-5E4F", game: "Free Fire", product: "310 Diamonds", price: "₦4,500", payStatus: "Failed", fulfillStatus: "Failed", date: "Oct 15, 13:45", customer: "Joy M.", email: "joy@example.com", supplier: "-", playerId: "102938475", cost: "₦0", margin: "₦0" },
  ];

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Main Content */}
      <div className={`space-y-6 flex flex-col h-full flex-1 transition-all duration-300 ${selectedOrder ? 'mr-[400px]' : ''}`}>
        <div className="flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search order ID..." 
                className="w-64 pl-9 pr-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB]"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F4F6FB] border-b border-[#E0E5F1] text-slate-500 font-semibold sticky top-0">
                <tr>
                  <th className="px-5 py-4 w-10">
                    <input type="checkbox" className="rounded border-slate-300 text-[#1E3BCB] focus:ring-[#1E3BCB]" />
                  </th>
                  <th className="px-5 py-4">ORDER REF</th>
                  <th className="px-5 py-4">CUSTOMER</th>
                  <th className="px-5 py-4">GAME & PACKAGE</th>
                  <th className="px-5 py-4">AMOUNT</th>
                  <th className="px-5 py-4">PAYMENT</th>
                  <th className="px-5 py-4">FULFILLMENT</th>
                  <th className="px-5 py-4">TIME</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E5F1]">
                {mockOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-slate-50 transition-colors h-[52px] cursor-pointer ${selectedOrder?.id === order.id ? 'bg-slate-50 border-l-2 border-l-[#1E3BCB]' : 'border-l-2 border-l-transparent'}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-5 w-10">
                      <input type="checkbox" className="rounded border-slate-300 text-[#1E3BCB] focus:ring-[#1E3BCB]" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="px-5 font-medium text-[#1E3BCB]">{order.id}</td>
                    <td className="px-5">
                      <div className="font-medium text-slate-900">{order.customer}</div>
                      <div className="text-xs text-slate-500">{order.email}</div>
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
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-[#E0E5F1] flex items-center justify-between text-sm text-slate-500 flex-shrink-0">
            <div>Showing 1 to 4 of 128 orders</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-[#E0E5F1] rounded-md disabled:opacity-50 hover:bg-slate-50">Prev</button>
              <button className="px-3 py-1 border border-[#E0E5F1] rounded-md bg-[#1E3BCB] text-white font-medium shadow-sm">1</button>
              <button className="px-3 py-1 border border-[#E0E5F1] rounded-md hover:bg-slate-50 text-slate-700">2</button>
              <button className="px-3 py-1 border border-[#E0E5F1] rounded-md hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Out Detail Drawer */}
      <div className={`absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l border-[#E0E5F1] transform transition-transform duration-300 ease-in-out flex flex-col z-20 ${selectedOrder ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedOrder && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#E0E5F1] bg-[#F4F6FB] flex-shrink-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{selectedOrder.id}</h2>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Copy size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={selectedOrder.payStatus} type="payment" />
                <StatusBadge status={selectedOrder.fulfillStatus} type="fulfillment" />
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Financial Breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Financial Breakdown</h3>
                <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Retail Price</span>
                    <span className="font-medium text-slate-900">{selectedOrder.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Supplier Cost</span>
                    <span className="font-medium text-slate-900">{selectedOrder.cost}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between text-sm font-semibold">
                    <span className="text-slate-700">Gross Margin</span>
                    <span className="text-emerald-600">{selectedOrder.margin}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Account Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Order Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Product/SKU</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right">{selectedOrder.game} - {selectedOrder.product}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Player ID (UID)</span>
                    <div className="col-span-2 font-medium text-slate-900 text-right flex items-center justify-end gap-2">
                      {selectedOrder.playerId}
                      <button className="text-slate-400 hover:text-slate-600"><Copy size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Customer</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right">{selectedOrder.customer} ({selectedOrder.email})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Gateway Ref</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right">ch_908321jklfs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Assigned Supplier</span>
                    <span className="col-span-2 font-medium text-[#1E3BCB] text-right">{selectedOrder.supplier}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Transaction Timeline</h3>
                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-slate-200"></div>
                  
                  {/* Nodes */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm flex items-center justify-center"></div>
                    <div className="text-sm font-semibold text-slate-900">Payment Verified</div>
                    <div className="text-xs text-slate-500 mt-0.5">Oct 5, 14:32:10</div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                    <div className="text-sm font-semibold text-slate-900">Sent to Shop2topup API</div>
                    <div className="text-xs text-slate-500 mt-0.5">Oct 5, 14:32:15</div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 bg-white p-0.5">
                      <AlertCircle size={18} className="text-amber-500" />
                    </div>
                    <div className="text-sm font-semibold text-amber-700">Supplier Gateway Timeout</div>
                    <div className="text-xs text-slate-500 mt-0.5">Oct 5, 14:33:45</div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[27px] top-0 bg-white p-0.5">
                      <Clock size={18} className="text-amber-500" />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">Routed to Manual Review Queue</div>
                    <div className="text-xs text-slate-500 mt-0.5">Oct 5, 14:33:50</div>
                  </div>
                </div>
              </div>

              {/* Internal Staff Log */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Internal Staff Log</h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-900">System</span>
                      <span className="text-xs text-slate-500">Oct 5, 14:33</span>
                    </div>
                    <div className="text-slate-600">Retries exhausted after 3 attempts. Requires operator decision.</div>
                  </div>
                  
                  <div className="mt-4">
                    <textarea 
                      placeholder="Add an internal note..." 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB] resize-none h-24 bg-white"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E0E5F1] bg-white flex items-center justify-end gap-3 flex-shrink-0">
              <button className="px-4 py-2 text-red-600 font-semibold text-sm hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200">
                Refund Order
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-[#1E3BCB] to-[#4B3FD6] text-white rounded-lg text-sm font-semibold shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
                Retry Top-up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, type }: { status: string, type: 'payment' | 'fulfillment' }) {
  let colors = "bg-slate-100 text-slate-600 border-slate-200";
  
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${colors}`}>
      {status}
    </span>
  );
}
