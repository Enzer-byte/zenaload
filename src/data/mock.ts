// MOCK DATA ONLY. Replace with database queries (DATABASE_URL) in production.
import type { Game, Product } from "@/types";
const idField = (label = "Player ID") => [{ key: "playerId", label, pattern: "^\\d{6,12}$", help: `Find your ${label} on your in-game profile screen.` }];
export const games: Game[] = [
  { id: "efootball", slug: "efootball", name: "eFootball", category: "Football", description: "Top up eFootball Coins.", playerFields: idField(), supplierId: "mock", active: true, featured: true, sortOrder: 1 },
  { id: "free-fire", slug: "free-fire", name: "Free Fire", category: "Battle Royale", description: "Buy Free Fire Diamonds.", playerFields: idField(), supplierId: "mock", active: true, featured: true, sortOrder: 2 },
  { id: "cod-mobile", slug: "call-of-duty-mobile", name: "Call of Duty: Mobile", category: "FPS", description: "Top up CODM CP.", playerFields: idField("Player UID"), supplierId: "mock", active: true, featured: true, sortOrder: 3 },
  { id: "dls", slug: "dream-league-soccer", name: "Dream League Soccer", category: "Football", description: "Get DLS coins.", playerFields: idField(), supplierId: "mock", active: true, featured: true, sortOrder: 4 },
  { id: "blood-strike", slug: "blood-strike", name: "Blood Strike", category: "Battle Royale", description: "Top up Blood Strike Gold.", playerFields: idField(), supplierId: "mock", active: true, featured: false, sortOrder: 5 },
];
const p = (gameId: string, rows: [number, number][]): Product[] => rows.map(([d, price], i) => ({ id: `${gameId}-${i}`, gameId, name: `${d.toLocaleString("en-NG")} ${gameId === "efootball" || gameId === "dls" ? "Coins" : "Credits"}`, denomination: d, currency: "NGN" as const, retailPrice: price, supplierCost: Math.round(price * 0.94), supplierProductId: `mock-${gameId}-${i}`, active: true, popular: i === 1 }));
export const products: Product[] = [
  ...p("efootball", [[137, 2000], [315, 4500], [578, 8100], [788, 11000], [1092, 15000], [2237, 30000], [3413, 45000], [5985, 75000], [13440, 160000], [32200, 369900]]),
  ...p("free-fire", [[100, 1500], [310, 4500], [520, 7500], [1060, 15000]]),
  ...p("cod-mobile", [[80, 1600], [420, 8000], [880, 16000]]),
  ...p("dls", [[550, 1200], [1200, 2500], [3200, 6500]]),
  ...p("blood-strike", [[100, 1000], [500, 5000], [1000, 10000]]),
];
