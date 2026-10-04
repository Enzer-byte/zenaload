import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import {
  isShop2topupConfigured,
  shop2topupRequest,
  Shop2topupAccount,
  Shop2topupBigCategory,
  Shop2topupCategory,
  Shop2topupSubcategory,
  Shop2topupRequirement,
} from "@/lib/providers/topup/shop2topup";
import { catalogStore } from "@/repositories/catalogStore";
import { config } from "@/config";
import type { Game, PlayerField, Product } from "@/types";

// POST /api/admin/supplier/shop2topup
// Handles:
// 1. { action: "status" } -> returns configured flag, account balance & details
// 2. { action: "browse", bigCategoryId?: number, categoryId?: number } -> returns categories, subcategories, requirements
// 3. { action: "import", categoryId: number, items: { subCategoryId: number; name: string; retailPrice: number; supplierCost: number; active?: boolean }[] } -> imports or updates game and products in store
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, message: "Not signed in as admin." }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    bigCategoryId?: number;
    categoryId?: number;
    items?: {
      subCategoryId: number;
      name: string;
      retailPrice: number;
      supplierCost: number;
      active?: boolean;
    }[];
  };

  const action = body.action ?? "status";

  if (action === "status") {
    const configured = isShop2topupConfigured();
    if (!configured) {
      return NextResponse.json({
        ok: true,
        configured: false,
        message: "Shop2topup API credentials are not set or are placeholders in .env.local",
        defaultRate: config.usdToNgnRate,
        defaultMargin: config.defaultMarginPercent,
      });
    }

    try {
      const res = await shop2topupRequest<{ account: Shop2topupAccount }>("/account");
      return NextResponse.json({
        ok: true,
        configured: true,
        account: res?.account,
        defaultRate: config.usdToNgnRate,
        defaultMargin: config.defaultMarginPercent,
      });
    } catch (e) {
      return NextResponse.json({
        ok: false,
        configured: true,
        message: e instanceof Error ? e.message : "Failed to fetch Shop2topup account.",
        defaultRate: config.usdToNgnRate,
        defaultMargin: config.defaultMarginPercent,
      });
    }
  }

  if (action === "browse") {
    if (!isShop2topupConfigured()) {
      return NextResponse.json({
        ok: false,
        message: "Shop2topup API credentials are not configured. Set SHOP2TOPUP_KEY_ID and SHOP2TOPUP_KEY_SECRET in .env.local",
      }, { status: 400 });
    }

    try {
      // 1. Fetch Big Categories and Categories in parallel
      const [bigCatsRes, catsRes] = await Promise.all([
        shop2topupRequest<{ success: boolean; data: Shop2topupBigCategory[] }>("/catalog/big-categories"),
        shop2topupRequest<{ success: boolean; data: Shop2topupCategory[] }>("/catalog/categories"),
      ]);

      const bigCategories = Array.isArray(bigCatsRes?.data) ? bigCatsRes.data : [];
      const allCategories = catsRes?.data ?? [];

      const selectedBigCatId = body.bigCategoryId ?? bigCategories[0]?.id;
      const categories = selectedBigCatId
        ? allCategories.filter((c) => c.big_category_id === selectedBigCatId)
        : allCategories;

      // 2. Fetch subcategories
      const selectedCatId = body.categoryId ?? categories[0]?.id;
      let subcategories: Shop2topupSubcategory[] = [];
      const requirements: Shop2topupRequirement[] = [];

      if (selectedCatId) {
        const subRes = await shop2topupRequest<{ success: boolean; data: Shop2topupSubcategory[] }>(
          "/catalog/subcategories"
        ).catch((err) => {
          console.warn("Subcategories fetch error:", err);
          return null;
        });
        const allSubs = subRes?.data ?? [];
        subcategories = allSubs.filter((s) => s.category_id === selectedCatId);

        // Derive requirements from category
        const cat = allCategories.find((c) => c.id === selectedCatId);
        if (cat?.requirements && typeof cat.requirements === "string") {
          requirements.push({
            name: cat.requirements,
            label: cat.requirements.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            type: "text",
            required: true,
            help: `Enter your ${cat.requirements.replace(/_/g, " ")}`,
          });
        }
      }

      // Check which products are already imported in local store
      const localProducts = await catalogStore.products();
      const importedSkuMap = new Set(localProducts.map((p) => p.supplierProductId));

      return NextResponse.json({
        ok: true,
        bigCategories,
        selectedBigCatId,
        categories,
        selectedCatId,
        subcategories: subcategories.map((s) => ({
          ...s,
          unit_price: String(s.price),
          isImported: importedSkuMap.has(String(s.id)),
        })),
        requirements,
      });
    } catch (e) {
      console.error("Browse error:", e);
      return NextResponse.json({
        ok: false,
        message: e instanceof Error ? e.message : "Failed to load catalogue from Shop2topup.",
      }, { status: 500 });
    }
  }

  if (action === "import") {
    const { categoryId, items } = body;
    if (!categoryId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, message: "No items selected to import." }, { status: 400 });
    }

    try {
      // Fetch category details from Shop2topup
      const catListRes = await shop2topupRequest<{ success: boolean; data: Shop2topupCategory[] }>(`/catalog/categories`);
      const cat = catListRes?.data?.find((c) => c.id === categoryId);
      const categoryName = cat?.big_category_name ? `${cat.big_category_name} (${cat.name})` : cat?.name ?? `Game ${categoryId}`;
      const slug = (cat?.big_category_name ? `${cat.big_category_name}-${cat.name}` : cat?.name ?? `game-${categoryId}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const existingGames = await catalogStore.games();
      let game = existingGames.find((g) => g.id === slug || g.slug === slug || g.id === String(categoryId));

      // Map Shop2topup requirements to Zenaload PlayerField[]
      const reqField = typeof cat?.requirements === "string" && cat.requirements.trim() ? cat.requirements.trim() : "player_id";
      const playerFields: PlayerField[] = [
        {
          key: reqField,
          label: reqField.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          help: `Enter your ${reqField.replace(/_/g, " ")} on your profile screen.`,
        },
      ];

      // Upsert game
      if (!game) {
        game = {
          id: slug,
          slug,
          name: categoryName,
          category: "Mobile Games",
          description: `${categoryName} instant top-up in Naira.`,
          playerFields,
          supplierId: "shop2topup",
          active: true,
          featured: false,
          sortOrder: Math.max(0, ...existingGames.map((g) => g.sortOrder)) + 1,
        };
        await catalogStore.saveGame(game);
      } else {
        // Ensure supplierId is shop2topup and playerFields are updated if needed
        game = {
          ...game,
          playerFields,
          supplierId: "shop2topup",
          active: true,
        };
        await catalogStore.saveGame(game);
      }

      // Upsert selected products
      const existingProducts = await catalogStore.products();
      let importedCount = 0;

      for (const item of items) {
        const sku = String(item.subCategoryId);
        const existingProd = existingProducts.find((p) => p.supplierProductId === sku);

        const prodId = existingProd?.id ?? `${game.id}-${item.subCategoryId}`;
        const prod: Product = {
          id: prodId,
          gameId: game.id,
          name: item.name,
          denomination: parseInt(item.name.replace(/\D+/g, "") || "1", 10),
          currency: "NGN",
          retailPrice: Math.round(item.retailPrice),
          supplierCost: Math.round(item.supplierCost),
          supplierProductId: sku,
          active: item.active !== false,
          featured: existingProd?.featured ?? false,
          popular: existingProd?.popular ?? false,
        };

        await catalogStore.saveProduct(prod);
        importedCount++;
      }

      return NextResponse.json({
        ok: true,
        message: `Successfully imported ${importedCount} product(s) for ${game.name}!`,
      });
    } catch (e) {
      return NextResponse.json({
        ok: false,
        message: e instanceof Error ? e.message : "Failed to import products.",
      }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: false, message: "Unknown action" }, { status: 400 });
}
