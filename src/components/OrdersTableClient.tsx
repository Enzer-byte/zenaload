"use client";

import { Search, Filter, Copy, X, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrdersTableClient({ orders, currentFilter, currentSearch }: { orders: any[], currentFilter: string, currentSearch: string }) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(() => {
    if (currentSearch && orders.length > 0) {
      const exact = orders.find((o) => o.id.toLowerCase() === currentSearch.toLowerCase());
      return exact || (orders.length === 1 ? orders[0] : null);
    }
    return null;
  });
  
  const [armed, setArmed] = useState("");
  const [msg, setMsg] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function runAction(action: string, id: string) {
    if ((action === "retry" || action === "refund") && armed !== action) {
      setArmed(action);
      setMsg(`Click again to confirm ${action}.`);
      return;
    }
    setArmed("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { 
        method: "POST", 
        body: JSON.stringify({ action, note }) 
      }).then((x) => x.json());
      
      setMsg(res.message);
      if (res.ok) {
        setNote("");
        router.refresh();
        // optionally wait a sec and clear message
        setTimeout(() => setMsg(""), 3000);
      }
    } catch {
      setMsg("Network error. Try again.");
    }
    setBusy(false);
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q")?.toString() || "";
    router.push(`/admin/orders?f=${currentFilter}&q=${encodeURIComponent(q)}`);
  };

  const handleFilter = (f: string) => {
    router.push(`/admin/orders?f=${f}&q=${encodeURIComponent(currentSearch)}`);
  };

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Main Content */}
      <div className={`space-y-6 flex flex-col h-full flex-1 transition-all duration-300 ${selectedOrder ? 'mr-[400px]' : ''}`}>
        <div className="flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                name="q"
                defaultValue={currentSearch}
                type="text" 
                placeholder="Search order ID, email..." 
                className="w-64 pl-9 pr-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3BCB]"
              />
            </form>
            <div className="flex bg-white border border-[#E0E5F1] rounded-lg p-1">
              {['All', 'Successful', 'Pending', 'Failed', 'Refunded'].map(f => (
                <button 
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${currentFilter === f ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            {orders.length === 0 ? (
               <div className="p-8 text-center text-slate-500">No orders match.</div>
            ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F4F6FB] border-b border-[#E0E5F1] text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Order ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Item</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Amount</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E5F1] text-sm bg-white">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setMsg("");
                      setArmed("");
                    }}
                    className={`hover:bg-slate-50 transition-colors h-[52px] cursor-pointer ${selectedOrder?.id === order.id ? 'bg-slate-50 border-l-2 border-l-[#1E3BCB]' : 'border-l-2 border-l-transparent'}`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-500">{order.date}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-900">{order.email}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-600 truncate max-w-[200px]">{order.game} - {order.product}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-slate-900 font-medium text-right">{order.price}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-center">
                      <div className="flex flex-col gap-1 items-center justify-center">
                        <StatusBadge status={order.payStatus} type="payment" />
                        <StatusBadge status={order.fulfillStatus} type="fulfillment" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      <div className={`absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l border-[#E0E5F1] transform transition-transform duration-300 ease-in-out flex flex-col z-20 ${selectedOrder ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedOrder && (
          <>
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E0E5F1] flex items-center justify-between bg-[#F4F6FB] flex-shrink-0">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Order Details</div>
                <h2 className="text-lg font-bold text-slate-900">{selectedOrder.id}</h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status & Financials */}
              <div>
                <div className="flex gap-2 mb-4">
                  <StatusBadge status={selectedOrder.payStatus} type="payment" />
                  <StatusBadge status={selectedOrder.fulfillStatus} type="fulfillment" />
                </div>
                
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
                  {Object.entries(selectedOrder.raw.playerFields).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500">{k}</span>
                      <div className="col-span-2 font-medium text-slate-900 text-right flex items-center justify-end gap-2">
                        {String(v)}
                        <button className="text-slate-400 hover:text-slate-600"><Copy size={14} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Customer</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right">{selectedOrder.email}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Phone</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right">{selectedOrder.phone || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Gateway Ref</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right break-all">{selectedOrder.raw.paymentRef || "—"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Supplier Ref</span>
                    <span className="col-span-2 font-medium text-[#1E3BCB] text-right break-all">{selectedOrder.raw.supplierTxId || "—"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Attempts</span>
                    <span className="col-span-2 font-medium text-slate-900 text-right">{selectedOrder.raw.retryCount || 0}</span>
                  </div>
                  {selectedOrder.raw.errorMessage && (
                    <div className="grid grid-cols-3 gap-2 mt-2 bg-red-50 p-2 rounded text-red-700 text-xs">
                      <span className="col-span-3 font-semibold break-words">{selectedOrder.raw.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Timeline and notes</h3>
                <div className="relative pl-6 space-y-6">
                  <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-slate-200"></div>
                  
                  {selectedOrder.raw.events.map((e: any, i: number) => {
                    let icon = <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>;
                    let textClass = "text-slate-900";
                    let bg = "";
                    
                    if (e.label.includes("Successful") || e.label.includes("Paid")) {
                      icon = <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>;
                    } else if (e.label.includes("Admin note:")) {
                      icon = <div className="absolute -left-[27px] top-0 bg-white p-0.5"><CheckCircle2 size={18} className="text-[#1E3BCB]" /></div>;
                      textClass = "text-[#1E3BCB]";
                      bg = "bg-blue-50 p-2 rounded mt-1";
                    } else if (e.label.toLowerCase().includes("fail") || e.label.toLowerCase().includes("error") || e.label.toLowerCase().includes("rejected")) {
                      icon = <div className="absolute -left-[27px] top-0 bg-white p-0.5"><AlertCircle size={18} className="text-red-500" /></div>;
                      textClass = "text-red-700";
                    } else if (e.label.includes("queue") || e.label.includes("review")) {
                      icon = <div className="absolute -left-[27px] top-0 bg-white p-0.5"><Clock size={18} className="text-amber-500" /></div>;
                      textClass = "text-amber-700";
                    } else if (e.label.includes("Refund")) {
                      icon = <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm"></div>;
                    }
                    
                    return (
                      <div key={i} className="relative">
                        {icon}
                        <div className={`text-sm font-semibold ${textClass} ${bg}`}>{e.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{e.at.slice(0, 19).replace("T", " ")}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Internal Staff Log */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Add Note</h3>
                <div className="space-y-4">
                  <div>
                    <textarea 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add an internal note..." 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB] resize-none h-24 bg-white"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button 
                        disabled={busy}
                        onClick={() => runAction("note", selectedOrder.id)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {msg && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-700 text-sm font-medium">
                  {msg}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E0E5F1] bg-white flex items-center justify-end gap-3 flex-shrink-0">
              <button 
                disabled={busy}
                onClick={() => runAction("review", selectedOrder.id)}
                className="px-4 py-2 text-amber-600 font-semibold text-sm hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200 disabled:opacity-50"
              >
                Review
              </button>
              <button 
                disabled={busy}
                onClick={() => runAction("refund", selectedOrder.id)}
                className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors border disabled:opacity-50 ${armed === "refund" ? "bg-red-600 text-white border-red-600" : "text-red-600 hover:bg-red-50 border-transparent hover:border-red-200"}`}
              >
                {armed === "refund" ? "Confirm Refund" : "Refund Order"}
              </button>
              <button 
                disabled={busy}
                onClick={() => runAction("retry", selectedOrder.id)}
                className={`px-6 py-2 text-white rounded-lg text-sm font-semibold shadow-md transition-opacity flex items-center gap-2 disabled:opacity-50 ${armed === "retry" ? "bg-emerald-600" : "bg-gradient-to-r from-[#1E3BCB] to-[#4B3FD6] hover:opacity-90"}`}
              >
                {armed === "retry" ? "Confirm Retry" : "Retry Top-up"}
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
