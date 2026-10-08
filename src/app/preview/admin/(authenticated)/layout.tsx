import { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Gamepad2,
  Server,
  Ticket,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Plus,
  Moon
} from "lucide-react";

export default function AdminPreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F4F6FB] text-slate-900 font-sans" style={{ fontFeatureSettings: '"tnum" 1' }}>
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 bg-[#0A1236] text-white flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="font-bold text-lg tracking-tight">Zenaload Admin</div>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          <NavItem href="/preview/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem href="/preview/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" badge="2" badgeColor="bg-amber-500" />
          <NavItem href="/preview/admin/products" icon={<Package size={18} />} label="Products" />
          <NavItem href="/preview/admin/games" icon={<Gamepad2 size={18} />} label="Games" />
          <NavItem href="/preview/admin/suppliers" icon={<Server size={18} />} label="Suppliers" />
          <NavItem href="/preview/admin/tickets" icon={<Ticket size={18} />} label="Tickets" badge="3" badgeColor="bg-blue-500" />
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">TB</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Tunde Bakare</div>
              <div className="text-xs text-slate-400 truncate">Lead Ops Engineer</div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Bar */}
        <header className="h-16 bg-white border-b border-[#E0E5F1] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="w-full pl-9 pr-12 py-2 bg-[#F4F6FB] border border-[#E0E5F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium px-1.5 py-0.5 border border-slate-200 rounded">
                Ctrl+K
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Gateway / 99.8%
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#1E3BCB] to-[#4B3FD6] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-opacity">
              <Plus size={16} />
              Create Order
            </button>
            <div className="w-px h-6 bg-[#E0E5F1]"></div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Moon size={20} />
            </button>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                5
              </span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active, badge, badgeColor }: { href: string, icon: ReactNode, label: string, active?: boolean, badge?: string, badgeColor?: string }) {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
        active ? "text-white bg-gradient-to-r from-[#1E3BCB] to-[#4B3FD6]" : "text-slate-300 hover:text-white hover:bg-[#18246B]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}`}>{icon}</span>
        {label}
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}
