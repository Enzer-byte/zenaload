import { Search, Filter, MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function TicketsPage() {
  const mockTickets = [
    { id: "TKT-1045", customer: "John Doe", subject: "Order not received", orderId: "ZL-20231015-8A2F", status: "Open", time: "10 mins ago", priority: "High" },
    { id: "TKT-1044", customer: "Sarah Smith", subject: "Wrong Player ID", orderId: "ZL-20231015-9B3C", status: "Open", time: "1 hour ago", priority: "Medium" },
    { id: "TKT-1043", customer: "Mike Johnson", subject: "Payment failed but debited", orderId: "ZL-20231014-5E4F", status: "Resolved", time: "1 day ago", priority: "High" },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-slate-500 text-sm mt-1">Manage customer inquiries and order issues.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter Status
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E0E5F1] flex items-center justify-between bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ticket ID or order ID..." 
              className="w-80 pl-9 pr-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB]"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F4F6FB] border-b border-[#E0E5F1] text-slate-500 font-semibold sticky top-0">
              <tr>
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E5F1]">
              {mockTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors h-[64px]">
                  <td className="px-6 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className={ticket.status === 'Open' ? 'text-[#1E3BCB]' : 'text-slate-400'} />
                      {ticket.id}
                    </div>
                  </td>
                  <td className="px-6 text-slate-700">{ticket.customer}</td>
                  <td className="px-6">
                    <div className="font-medium text-slate-900">{ticket.subject}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'High' ? 'bg-[#C93535]' : 'bg-amber-500'}`}></span>
                      {ticket.priority} Priority
                    </div>
                  </td>
                  <td className="px-6 font-medium text-[#1E3BCB] hover:underline cursor-pointer">
                    {ticket.orderId}
                  </td>
                  <td className="px-6 text-slate-500 flex items-center gap-1 mt-3">
                    <Clock size={14} />
                    {ticket.time}
                  </td>
                  <td className="px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ticket.status === 'Open' ? 'bg-[#FFF1D6] text-[#B26A00]' : 'bg-slate-100 text-slate-600'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6">
                    {ticket.status === 'Open' ? (
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-[#E3F6EA] text-[#0F8A4A] rounded hover:bg-[#c2efd3] font-medium transition-colors text-xs">
                        <CheckCircle size={14} />
                        Resolve
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 px-3 py-1.5 border border-[#E0E5F1] text-slate-600 rounded hover:bg-slate-50 font-medium transition-colors text-xs">
                        Reopen
                      </button>
                    )}
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
