import { Bell, AlertTriangle, CheckCircle2, Info, Check } from "lucide-react";

export default function NotificationsPage() {
  const mockNotifications = [
    {
      id: 1,
      type: "warning",
      title: "Low Supplier Balance",
      message: "Reloadly balance has dropped below ₦50,000 threshold.",
      time: "10 mins ago",
      read: false
    },
    {
      id: 2,
      type: "error",
      title: "Fulfillment Failed (Retries Exhausted)",
      message: "Order ZL-20231015-7C1D failed to fulfill after 4 attempts.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 3,
      type: "success",
      title: "Daily Settlement Successful",
      message: "Paystack settlement of ₦450,200 has been processed.",
      time: "1 day ago",
      read: true
    },
    {
      id: 4,
      type: "info",
      title: "New Game Added",
      message: "System operator added 'Mobile Legends' to the catalog.",
      time: "2 days ago",
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'error': return <AlertTriangle className="text-[#C93535]" size={20} />;
      case 'success': return <CheckCircle2 className="text-[#0F8A4A]" size={20} />;
      default: return <Info className="text-[#2D5BFF]" size={20} />;
    }
  };

  const getBg = (type: string, read: boolean) => {
    if (read) return 'bg-white opacity-70';
    switch(type) {
      case 'warning': return 'bg-[#FFF1D6]/30';
      case 'error': return 'bg-[#FCE5E5]/30';
      case 'success': return 'bg-[#E3F6EA]/30';
      default: return 'bg-[#E6ECFF]/30';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">Alerts, system events, and operations log.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors">
          <Check size={16} />
          Mark all as read
        </button>
      </div>

      <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm overflow-hidden divide-y divide-[#E0E5F1]">
        {mockNotifications.map((notif) => (
          <div key={notif.id} className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 ${getBg(notif.type, notif.read)}`}>
            <div className="shrink-0 mt-0.5">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h3 className={`font-semibold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
              </div>
              <p className={`text-sm mt-1 ${notif.read ? 'text-slate-500' : 'text-slate-700'}`}>
                {notif.message}
              </p>
              
              {!notif.read && (
                <div className="mt-3">
                  <button className="text-xs font-semibold text-[#1E3BCB] hover:text-[#18246B]">
                    Mark as read
                  </button>
                </div>
              )}
            </div>
            {!notif.read && (
              <div className="shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#1E3BCB] rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
