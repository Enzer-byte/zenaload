import { GamesEditor } from "@/components/CatalogEditor";
import { catalogStore } from "@/repositories/catalogStore";
export default async function GamesAdmin() { return (<><h1 className="mb-4 text-2xl font-semibold">Games</h1><GamesEditor games={(await catalogStore.games()).sort((a, b) => a.sortOrder - b.sortOrder)} /></>); }
