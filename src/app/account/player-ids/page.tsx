export const dynamic = "force-dynamic"; // catalogue is editable in admin, so never serve a stale build-time copy
import { PlayerIds } from "@/components/AccountViews";
import { productService } from "@/services/productService";
export default async function P() { const games = (await productService.listGames()).map((g) => ({ slug: g.slug, name: g.name, fieldLabel: g.playerFields[0]?.label ?? "Player ID" })); return (<><h2 className="mb-4 text-xl font-semibold">Saved Player IDs</h2><PlayerIds games={games} /></>); }
