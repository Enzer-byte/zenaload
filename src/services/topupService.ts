import type { TopupProvider } from "@/types";
import { getTopupProvider } from "@/lib/providers/topup";
export const topupService = { validate: (supplierId: string, gameId: string, f: Record<string, string>) => getTopupProvider(supplierId).validatePlayer(gameId, f), create: (supplierId: string, i: Parameters<TopupProvider["createTopup"]>[0]) => getTopupProvider(supplierId).createTopup(i) };
