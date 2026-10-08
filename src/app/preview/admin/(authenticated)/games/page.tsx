import { Plus, Search, GripVertical, Image as ImageIcon, EyeOff } from "lucide-react";

export default function GamesPage() {
  const mockGames = [
    { id: "free-fire", name: "Free Fire", publisher: "Garena", category: "Battle Royale", productsCount: 12, active: true },
    { id: "codm", name: "Call of Duty: Mobile", publisher: "Activision", category: "Shooter", productsCount: 8, active: true },
    { id: "pubg-mobile", name: "PUBG Mobile", publisher: "Level Infinite", category: "Battle Royale", productsCount: 15, active: true },
    { id: "efootball", name: "eFootball 2024", publisher: "Konami", category: "Sports", productsCount: 5, active: false },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Games Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage game catalog, artwork, and visibility.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1E3BCB] text-white rounded-lg text-sm font-medium hover:bg-[#18246B] transition-colors shadow-sm">
          <Plus size={16} />
          Add Game
        </button>
      </div>

      <div className="bg-white border border-[#E0E5F1] rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E0E5F1] flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search games..." 
              className="w-64 pl-9 pr-4 py-2 bg-[#F4F6FB] border border-[#E0E5F1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3BCB]"
            />
          </div>
          <div className="text-sm text-slate-500">Drag to reorder display sequence</div>
        </div>

        <div className="overflow-x-auto flex-1 p-2">
          <div className="space-y-2">
            {mockGames.map((game) => (
              <div 
                key={game.id} 
                className={`flex items-center p-3 border rounded-lg transition-colors hover:bg-slate-50 ${game.active ? 'border-[#E0E5F1] bg-white' : 'border-slate-200 bg-slate-50 opacity-75'}`}
              >
                <div className="px-2 text-slate-400 cursor-grab hover:text-slate-700">
                  <GripVertical size={18} />
                </div>
                
                <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 mx-4 shrink-0 overflow-hidden relative">
                  <ImageIcon size={20} />
                  {!game.active && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                      <EyeOff size={16} className="text-slate-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{game.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{game.publisher}</span>
                    <span>•</span>
                    <span>{game.category}</span>
                  </div>
                </div>
                
                <div className="px-6 text-center">
                  <div className="text-sm font-semibold">{game.productsCount}</div>
                  <div className="text-xs text-slate-500">Products</div>
                </div>
                
                <div className="px-6 border-l border-[#E0E5F1]">
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${game.active ? 'bg-[#0F8A4A]' : 'bg-slate-300'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${game.active ? 'translate-x-4' : 'translate-x-1'}`} />
                  </div>
                </div>
                
                <div className="px-4">
                  <button className="text-sm font-medium text-[#2D5BFF] hover:text-[#18246B]">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
