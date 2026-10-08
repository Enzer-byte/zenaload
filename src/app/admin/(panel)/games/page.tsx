import { GamesEditor } from "@/components/CatalogEditor";
import { catalogStore } from "@/repositories/catalogStore";

export const dynamic = "force-dynamic";

export default async function GamesAdmin() { 
  return (
    <>
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">Games</h1>
      <p className="mb-6 text-sm text-slate-500">Manage supported games and player ID fields.</p>
      <GamesEditor games={(await catalogStore.games()).sort((a, b) => a.sortOrder - b.sortOrder)} />
    </>
  ); 
}
