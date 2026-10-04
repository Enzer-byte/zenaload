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
    return <div className="p-8 text-center text-ink2">Connecting to Shop2topup...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Account & Wallet Status Card */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${configured ? "bg-emerald-400" : "bg-amber-400"}`} />
              <h2 className="text-lg font-semibold text-ink">Shop2topup Reseller Account</h2>
            </div>
            <p className="mt-1 text-sm text-ink2">
              {configured
                ? account
                  ? `Connected as ${account.email}`
                  : "API Configured (ready for live sync)"
                : "Credentials not detected. Add SHOP2TOPUP_KEY_ID & SHOP2TOPUP_KEY_SECRET to .env.local"}
            </p>
          </div>

          {account && (
            <div className="flex items-center gap-3 rounded-xl border border-line bg-bg2 px-4 py-2.5">
              <div>
                <div className="text-xs font-medium text-mute">WALLET BALANCE (USD)</div>
                <div className="text-xl font-bold text-emerald-400">${parseFloat(account.wallet || "0").toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm text-hi">
          {statusMsg}
        </div>
      )}

      {/* Pricing Conversion Settings */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-mute">Import Pricing & Currency Calculator</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="block text-xs text-ink2">USD to NGN Exchange Rate (₦/$)</label>
            <div className="mt-1 flex items-center rounded-xl border border-line bg-bg2 px-3 py-2">
              <span className="text-mute mr-1">₦</span>
              <input
                type="number"
                aria-label="USD to NGN Exchange Rate"
                className="w-full bg-transparent text-sm outline-none"
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
            <label className="block text-xs text-ink2">Default Profit Margin (%)</label>
            <div className="mt-1 flex items-center rounded-xl border border-line bg-bg2 px-3 py-2">
              <input
                type="number"
                aria-label="Default Profit Margin"
                className="w-full bg-transparent text-sm outline-none"
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
              <span className="text-mute ml-1">%</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center text-xs text-mute bg-bg2/50 rounded-xl p-3 border border-line">
            Wholesale costs are calculated live from Shop2topup in USD and converted to Naira. Customers only ever see your retail Naira price.
          </div>
        </div>
      </div>

      {/* Catalogue Explorer & Selector */}
      <div className="rounded-2xl border border-line bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">Browse Shop2topup Catalogue</h3>
            <p className="text-xs text-mute">Select games and denominations to import or update in Zenaload.</p>
          </div>

          {configured && (
            <button
              onClick={() => loadBrowse(selectedBigCatId, selectedCatId)}
              disabled={catalogLoading}
              className="rounded-xl border border-line bg-bg2 px-3.5 py-1.5 text-xs text-ink hover:border-brand disabled:opacity-50"
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
                <label className="block text-xs text-mute mb-1">1. Choose Big Category</label>
                <select
                  aria-label="Shop2topup Big Category"
                  className="w-full rounded-xl border border-line bg-bg2 px-3 py-2 text-sm text-ink outline-none"
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
                <label className="block text-xs text-mute mb-1">2. Choose Game / Category</label>
                <select
                  aria-label="Shop2topup Game Category"
                  className="w-full rounded-xl border border-line bg-bg2 px-3 py-2 text-sm text-ink outline-none"
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
              <div className="rounded-xl border border-line/60 bg-bg2/60 p-3 text-xs text-ink2">
                <span className="font-semibold text-ink">Required Player Input Fields for this Game: </span>
                {requirements.map((r) => `${r.label || r.name} (${r.type})`).join(", ")}
              </div>
            )}

            {/* Denominations Table */}
            {catalogLoading ? (
              <div className="py-12 text-center text-sm text-ink2">Loading live denominations from Shop2topup...</div>
            ) : subcategories.length === 0 ? (
              <div className="py-8 text-center text-sm text-mute">No products found in this category.</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-mute">
                  <div className="flex gap-2">
                    <button onClick={() => toggleAll(true)} className="hover:text-ink">Select All</button>
                    <span>|</span>
                    <button onClick={() => toggleAll(false)} className="hover:text-ink">Deselect All</button>
                  </div>
                  <div>
                    {subcategories.filter((s) => selectedItems[s.id]).length} of {subcategories.length} selected
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-line">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead className="bg-bg2 text-left text-xs text-mute">
                      <tr>
                        <th className="p-3 w-10">
                          <input
                            type="checkbox"
                            aria-label="Select all products"
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
                    <tbody className="divide-y divide-line">
                      {subcategories.map((s) => {
                        const usd = parseFloat(s.unit_price);
                        const costNgn = Math.ceil(usd * usdRate);
                        const retail = customPrices[s.id] ?? Math.ceil(costNgn * (1 + marginPercent / 100));
                        const marginVal = retail > 0 ? Math.round(((retail - costNgn) / retail) * 100) : 0;
                        const isChecked = !!selectedItems[s.id];

                        return (
                          <tr key={s.id} className={isChecked ? "bg-brand/5" : ""}>
                            <td className="p-3">
                              <input
                                type="checkbox"
                                aria-label={`Select ${s.name}`}
                                checked={isChecked}
                                onChange={() => toggleItem(s.id)}
                              />
                            </td>
                            <td className="p-3 font-medium text-ink">
                              <div>{s.name}</div>
                              <span className="text-[11px] text-mute font-mono">SKU: {s.id}</span>
                            </td>
                            <td className="p-3 text-ink2">${usd.toFixed(4)}</td>
                            <td className="p-3 font-mono text-ink2">{ngn(costNgn)}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                aria-label={`Retail price for ${s.name}`}
                                className="w-28 rounded-lg border border-line bg-bg2 px-2.5 py-1 text-xs text-ink outline-none focus:border-brand"
                                value={retail}
                                onChange={(e) => setPrice(s.id, Number(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-3">
                              <span className={`text-xs font-medium ${marginVal >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {marginVal}%
                              </span>
                            </td>
                            <td className="p-3">
                              {s.isImported ? (
                                <span className="inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                                  Imported
                                </span>
                              ) : (
                                <span className="inline-block rounded-md bg-zinc-700/30 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
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
                    className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:opacity-90 disabled:opacity-40"
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
          <div className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink2">
            <p className="font-semibold text-ink">Shop2topup API Credentials Required</p>
            <p className="mt-1 text-xs text-mute">
              To browse live wholesale categories and import top-up products, please add your keys to <code className="text-hi">.env.local</code>:
            </p>
            <pre className="mx-auto mt-4 max-w-md rounded-lg bg-bg2 p-3 text-left font-mono text-xs text-ink2">
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
