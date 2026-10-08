"use client";

import { useState, useEffect } from "react";
import { ngn } from "@/config";

interface Shop2topupAccount {
  email: string;
  wallet: string;
}

interface BigCategory {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  big_category_id: number;
  player_validation: boolean;
  active: boolean;
}

interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  unit_price: string;
  active: boolean;
  min_quantity: number;
  max_quantity: number;
  isImported?: boolean;
}

interface Requirement {
  name: string;
  label: string;
  type: string;
  required: boolean;
  help?: string;
}

export function Shop2topupExplorer() {
  const [loading, setLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [account, setAccount] = useState<Shop2topupAccount | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Exchange rate & margin
  const [usdRate, setUsdRate] = useState<number>(1600);
  const [marginPercent, setMarginPercent] = useState<number>(10);

  // Explorer hierarchy
  const [bigCats, setBigCats] = useState<BigCategory[]>([]);
  const [selectedBigCatId, setSelectedBigCatId] = useState<number | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | undefined>();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  // Selection & customization for import
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [customPrices, setCustomPrices] = useState<Record<number, number>>({});

  // 1. Fetch Status & Account Balance
  useEffect(() => {
    async function loadStatus() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/supplier/shop2topup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "status" }),
        }).then((r) => r.json());

        setConfigured(!!res.configured);
        if (res.defaultRate) setUsdRate(res.defaultRate);
        if (res.defaultMargin) setMarginPercent(res.defaultMargin);

        if (res.account) {
          setAccount(res.account);
        } else if (res.message) {
          setStatusMsg(res.message);
        }

        if (res.configured) {
          loadBrowse();
        }
      } catch {
        setStatusMsg("Failed to communicate with supplier service.");
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  // 2. Fetch Catalogue
  async function loadBrowse(bigCatId?: number, catId?: number) {
    try {
      setCatalogLoading(true);
      setStatusMsg("");
      const res = await fetch("/api/admin/supplier/shop2topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "browse", bigCategoryId: bigCatId, categoryId: catId }),
      }).then((r) => r.json());

      if (res.ok) {
        setBigCats(res.bigCategories || []);
        setSelectedBigCatId(res.selectedBigCatId);
        setCategories(res.categories || []);
        setSelectedCatId(res.selectedCatId);
        setSubcategories(res.subcategories || []);
        setRequirements(res.requirements || []);

        // Pre-select items that are not yet imported
        const sel: Record<number, boolean> = {};
        const prices: Record<number, number> = {};
        for (const item of res.subcategories || []) {
          sel[item.id] = !item.isImported;
          const costNgn = Math.ceil(parseFloat(item.unit_price) * usdRate);
          prices[item.id] = Math.ceil(costNgn * (1 + marginPercent / 100));
        }
        setSelectedItems(sel);
        setCustomPrices(prices);
      } else {
        setStatusMsg(res.message || "Failed to load Shop2topup catalogue.");
      }
    } catch {
      setStatusMsg("Error connecting to server.");
    } finally {
      setCatalogLoading(false);
    }
  }

  // Handle Big Category Change
  function handleBigCatChange(id: number) {
    setSelectedBigCatId(id);
    loadBrowse(id, undefined);
  }

  // Handle Category (Game) Change
  function handleCatChange(id: number) {
    setSelectedCatId(id);
    loadBrowse(selectedBigCatId, id);
  }

  // Toggle selection
  function toggleItem(id: number) {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Select all / none
  function toggleAll(selectAll: boolean) {
    const sel: Record<number, boolean> = {};
    for (const item of subcategories) {
      sel[item.id] = selectAll;
    }
    setSelectedItems(sel);
  }

  // Update Retail Price
  function setPrice(id: number, val: number) {
    setCustomPrices((prev) => ({ ...prev, [id]: val }));
  }

  // 3. Import Selected Products
  async function handleImport() {
    if (!selectedCatId) return;
    const itemsToImport = subcategories
      .filter((s) => selectedItems[s.id])
      .map((s) => {
        const costNgn = Math.ceil(parseFloat(s.unit_price) * usdRate);
        const retailNgn = customPrices[s.id] ?? Math.ceil(costNgn * (1 + marginPercent / 100));
        return {
          subCategoryId: s.id,
          name: s.name,
          supplierCost: costNgn,
          retailPrice: retailNgn,
          active: s.active,
        };
      });

    if (itemsToImport.length === 0) {
      setStatusMsg("Please select at least one item to import.");
      return;
    }

    try {
      setImporting(true);
      setStatusMsg("");
      const res = await fetch("/api/admin/supplier/shop2topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import",
          categoryId: selectedCatId,
          items: itemsToImport,
        }),
      }).then((r) => r.json());

      if (res.ok) {
        setStatusMsg(res.message);
        // Refresh items list to update isImported flag
        loadBrowse(selectedBigCatId, selectedCatId);
      } else {
        setStatusMsg(res.message || "Import failed.");
      }
    } catch {
      setStatusMsg("Network error during import.");
    } finally {
      setImporting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Connecting to Shop2topup...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Account & Wallet Status Card */}
      <div className="rounded-xl border border-[#E0E5F1] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${configured ? "bg-emerald-500" : "bg-amber-500"}`} />
              <h2 className="text-lg font-semibold text-slate-900">Shop2topup Reseller Account</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {configured
                ? account
                  ? `Connected as ${account.email}`
                  : "API Configured (ready for live sync)"
                : "Credentials not detected. Add SHOP2TOPUP_KEY_ID & SHOP2TOPUP_KEY_SECRET to .env.local"}
            </p>
          </div>

          {account && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E0E5F1] bg-[#F4F6FB] px-4 py-2.5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">WALLET BALANCE (USD)</div>
                <div className="text-xl font-bold text-emerald-600">${parseFloat(account.wallet || "0").toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 font-medium">
          {statusMsg}
        </div>
      )}

      {/* Pricing Conversion Settings */}
      <div className="rounded-xl border border-[#E0E5F1] bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Import Pricing & Currency Calculator</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-slate-600">USD to NGN Exchange Rate (₦/$)</label>
            <div className="mt-1 flex items-center rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-3 py-2 text-slate-900">
              <span className="text-slate-400 mr-1">₦</span>
              <input
                type="number"
                aria-label="USD to NGN Exchange Rate"
                className="w-full bg-transparent text-sm outline-none font-medium"
                value={usdRate}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  setUsdRate(val);
                  // Update recalculated prices
                  setCustomPrices((prev) => {
                    const next = { ...prev };
                    for (const s of subcategories) {
                      const cost = Math.ceil(parseFloat(s.unit_price) * val);
                      next[s.id] = Math.ceil(cost * (1 + marginPercent / 100));
                    }
                    return next;
                  });
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Default Profit Margin (%)</label>
            <div className="mt-1 flex items-center rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-3 py-2 text-slate-900">
              <input
                type="number"
                aria-label="Default Profit Margin"
                className="w-full bg-transparent text-sm outline-none font-medium"
                value={marginPercent}
                onChange={(e) => {
                  const val = Number(e.target.value) || 0;
                  setMarginPercent(val);
                  // Update recalculated prices
                  setCustomPrices((prev) => {
                    const next = { ...prev };
                    for (const s of subcategories) {
                      const cost = Math.ceil(parseFloat(s.unit_price) * usdRate);
                      next[s.id] = Math.ceil(cost * (1 + val / 100));
                    }
                    return next;
                  });
                }}
              />
              <span className="text-slate-500 font-medium ml-1">%</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center text-xs text-slate-500 bg-[#F4F6FB] rounded-lg p-3 border border-[#E0E5F1]">
            Wholesale costs are calculated live from Shop2topup in USD and converted to Naira. Customers only ever see your retail Naira price.
          </div>
        </div>
      </div>

      {/* Catalogue Explorer & Selector */}
      <div className="rounded-xl border border-[#E0E5F1] bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Browse Shop2topup Catalogue</h3>
            <p className="text-xs text-slate-500">Select games and denominations to import or update in Zenaload.</p>
          </div>

          {configured && (
            <button
              onClick={() => loadBrowse(selectedBigCatId, selectedCatId)}
              disabled={catalogLoading}
              className="rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              {catalogLoading ? "Refreshing..." : "↻ Refresh Live Data"}
            </button>
          )}
        </div>

        {configured ? (
          <div className="space-y-4">
            {/* Category Dropdowns */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">1. Choose Big Category</label>
                <select
                  aria-label="Shop2topup Big Category"
                  className="w-full rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1E3BCB]"
                  value={selectedBigCatId ?? ""}
                  onChange={(e) => handleBigCatChange(Number(e.target.value))}
                >
                  {bigCats.map((bc) => (
                    <option key={bc.id} value={bc.id}>
                      {bc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">2. Choose Game / Category</label>
                <select
                  aria-label="Shop2topup Game Category"
                  className="w-full rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#1E3BCB]"
                  value={selectedCatId ?? ""}
                  onChange={(e) => handleCatChange(Number(e.target.value))}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.player_validation ? "✓ (ID check)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Requirements Info */}
            {requirements.length > 0 && (
              <div className="rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] p-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Required Player Input Fields for this Game: </span>
                {requirements.map((r) => `${r.label || r.name} (${r.type})`).join(", ")}
              </div>
            )}

            {/* Denominations Table */}
            {catalogLoading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading live denominations from Shop2topup...</div>
            ) : subcategories.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">No products found in this category.</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex gap-2">
                    <button onClick={() => toggleAll(true)} className="hover:text-slate-900 font-medium">Select All</button>
                    <span>|</span>
                    <button onClick={() => toggleAll(false)} className="hover:text-slate-900 font-medium">Deselect All</button>
                  </div>
                  <div>
                    {subcategories.filter((s) => selectedItems[s.id]).length} of {subcategories.length} selected
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#E0E5F1]">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead className="bg-[#F4F6FB] text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            aria-label="Select all products"
                            className="rounded border-[#E0E5F1] text-[#1E3BCB] focus:ring-[#1E3BCB]"
                            checked={subcategories.length > 0 && subcategories.every((s) => selectedItems[s.id])}
                            onChange={(e) => toggleAll(e.target.checked)}
                          />
                        </th>
                        <th className="p-3">SKU / Item</th>
                        <th className="p-3">Wholesale (USD)</th>
                        <th className="p-3">Cost (NGN)</th>
                        <th className="p-3">Retail Price (NGN)</th>
                        <th className="p-3">Margin</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E0E5F1] bg-white">
                      {subcategories.map((s) => {
                        const usd = parseFloat(s.unit_price);
                        const costNgn = Math.ceil(usd * usdRate);
                        const retail = customPrices[s.id] ?? Math.ceil(costNgn * (1 + marginPercent / 100));
                        const marginVal = retail > 0 ? Math.round(((retail - costNgn) / retail) * 100) : 0;
                        const isChecked = !!selectedItems[s.id];

                        return (
                          <tr key={s.id} className={isChecked ? "bg-blue-50/50" : "hover:bg-slate-50"}>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                aria-label={`Select ${s.name}`}
                                className="rounded border-[#E0E5F1] text-[#1E3BCB] focus:ring-[#1E3BCB]"
                                checked={isChecked}
                                onChange={() => toggleItem(s.id)}
                              />
                            </td>
                            <td className="p-3 font-medium text-slate-900">
                              <div>{s.name}</div>
                              <span className="text-[11px] text-slate-400 font-mono">SKU: {s.id}</span>
                            </td>
                            <td className="p-3 text-slate-600">${usd.toFixed(4)}</td>
                            <td className="p-3 font-mono text-slate-700">{ngn(costNgn)}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                aria-label={`Retail price for ${s.name}`}
                                className="w-28 rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-[#1E3BCB]"
                                value={retail}
                                onChange={(e) => setPrice(s.id, Number(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-3">
                              <span className={`text-xs font-semibold ${marginVal >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                {marginVal}%
                              </span>
                            </td>
                            <td className="p-3">
                              {s.isImported ? (
                                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                  Imported
                                </span>
                              ) : (
                                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
                                  New
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Import Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleImport}
                    disabled={importing || subcategories.filter((s) => selectedItems[s.id]).length === 0}
                    className="rounded-lg bg-[#1E3BCB] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18246B] disabled:opacity-40"
                  >
                    {importing
                      ? "Importing to Store..."
                      : `Import ${subcategories.filter((s) => selectedItems[s.id]).length} Selected to Store`}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E0E5F1] p-8 text-center text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Shop2topup API Credentials Required</p>
            <p className="mt-1 text-xs text-slate-500">
              To browse live wholesale categories and import top-up products, please add your keys to <code className="text-[#1E3BCB]">.env.local</code>:
            </p>
            <pre className="mx-auto mt-4 max-w-md rounded-lg bg-[#F4F6FB] border border-[#E0E5F1] p-3 text-left font-mono text-xs text-slate-700">
              SHOP2TOPUP_KEY_ID=your_key_id{"\n"}
              SHOP2TOPUP_KEY_SECRET=your_key_secret{"\n"}
              TOPUP_PROVIDERS=shop2topup,mock
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
