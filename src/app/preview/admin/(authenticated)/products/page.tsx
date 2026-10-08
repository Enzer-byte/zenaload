import { Search, Plus, Filter, AlertTriangle, ArrowRight } from "lucide-react";

export default function ProductsPage() {
  const mockProducts = [
    { id: "P-101", game: "Free Fire", name: "100 Diamonds", retail: "₦1,500", wholesale: "₦1,350", margin: "10.0%", active: true, warning: false },
    { id: "P-102", game: "Free Fire", name: "310 Diamonds", retail: "₦4,500", wholesale: "₦4,200", margin: "6.6%", active: true, warning: true },
    { id: "P-103", game: "CODM", name: "80 CP", retail: "₦2,000", wholesale: "₦1,600", margin: "20.0%", active: true, warning: false },
    { id: "P-104", game: "PUBG Mobile", name: "60 UC", retail: "₦1,200", wholesale: "₦1,050", margin: "12.5%", active: false, warning: false },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products & Pricing</h1>
          <p className="text-slate-500 text-sm mt-1">Manage SKUs, retail pricing, and profit margins.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3BCB] text-white rounded-lg text-sm font-medium hover:bg-[#18246B] transition-colors shadow-sm">
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E0E5F1] flex items-center justify-between bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products by game or name..." 
              className="w-80 pl-9 pr-4 py-2 bg-white border border-[#E0E5F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB]"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#0F8A4A] rounded-sm"></div>
              Healthy Margin (&gt;10%)
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
              Low Margin (&lt;10%)
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F4F6FB] border-b border-[#E0E5F1] text-slate-500 font-semibold sticky top-0">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4 text-right">Wholesale Cost</th>
                <th className="px-6 py-4 text-right">Retail Price</th>
                <th className="px-6 py-4 text-right">Margin</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E5F1]">
              {mockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors h-[52px]">
                  <td className="px-6 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      {product.name}
                      {product.warning && (
                        <span title="Low margin warning">
                          <AlertTriangle size={14} className="text-amber-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-normal">{product.id}</div>
                  </td>
                  <td className="px-6 text-slate-600">{product.game}</td>
                  <td className="px-6 text-right text-slate-500 font-medium">{product.wholesale}</td>
                  <td className="px-6 text-right font-bold">{product.retail}</td>
                  <td className="px-6 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${product.warning ? 'bg-amber-100 text-amber-800' : 'bg-[#E3F6EA] text-[#0F8A4A]'}`}>
                      {product.margin}
                    </span>
                  </td>
                  <td className="px-6 text-center">
                    <div className="flex items-center justify-center">
                      <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${product.active ? 'bg-[#0F8A4A]' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${product.active ? 'translate-x-4' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 text-right">
                    <button className="text-[#2D5BFF] hover:text-[#18246B] text-sm font-medium flex items-center gap-1 justify-end ml-auto">
                      Edit <ArrowRight size={14} />
                    </button>
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
