"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Game, Product } from "@/types";
import { ngn } from "@/config";

function useSend() {
  const r = useRouter();
  const [msg, setMsg] = useState("");
  const send = async (body: object) => {
    const j = await fetch("/api/admin/catalog", { method: "POST", body: JSON.stringify(body) })
      .then((x) => x.json())
      .catch(() => ({ ok: false, message: "Network error. Try again." }));
    setMsg(j.message);
    if (j.ok) r.refresh();
    return !!j.ok;
  };
  return { msg, send };
}

const inp = "w-full rounded-lg border border-[#E0E5F1] bg-[#F4F6FB] px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E3BCB] focus:outline-none";
const card = "mt-6 rounded-xl border border-[#E0E5F1] bg-white shadow-sm p-5";

const Tg = ({ on, onClick, label }: { on?: boolean; onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={!!on}
    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
      on ? "border-[#1E3BCB] bg-[#E6ECFF] text-[#1E3BCB]" : "border-[#E0E5F1] text-slate-500 hover:bg-slate-50"
    }`}
  >
    {label}
  </button>
);

const Msg = ({ m }: { m: string }) => (m ? <p role="status" className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-sm text-amber-700">{m}</p> : null);

function PRow({ p, gname, send }: { p: Product; gname: string; send: (b: object) => Promise<boolean> }) {
  const [price, setPrice] = useState(String(p.retailPrice));
  const [origPrice, setOrigPrice] = useState(p.originalPrice ? String(p.originalPrice) : "");
  const [cost, setCost] = useState(String(p.supplierCost));

  const parsedPrice = +price || 0;
  const parsedOrig = +origPrice || 0;
  const parsedCost = +cost || 0;

  const hasDiscount = parsedOrig > parsedPrice && parsedPrice > 0;
  const discountPct = hasDiscount ? Math.round(((parsedOrig - parsedPrice) / parsedOrig) * 100) : 0;
  const margin = parsedPrice > 0 ? Math.round(((parsedPrice - parsedCost) / parsedPrice) * 100) : 0;

  const dirty =
    parsedPrice !== p.retailPrice ||
    parsedCost !== p.supplierCost ||
    (parsedOrig > 0 ? parsedOrig : undefined) !== p.originalPrice;

  return (
    <tr className="border-t border-[#E0E5F1] text-sm hover:bg-slate-50 transition-colors">
      <td className="p-3 text-slate-500">{gname}</td>
      <td className="p-3 font-medium text-slate-900">{p.name}</td>
      <td className="p-3">
        <div className="relative">
          <input
            aria-label={`Retail price ${p.name}`}
            className={inp}
            style={{ width: 110 }}
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </td>
      <td className="p-3">
        <input
          aria-label={`Original price ${p.name}`}
          placeholder="None (no discount)"
          className={inp}
          style={{ width: 125 }}
          inputMode="numeric"
          value={origPrice}
          onChange={(e) => setOrigPrice(e.target.value)}
        />
      </td>
      <td className="p-3">
        {hasDiscount ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            -{discountPct}%
          </span>
        ) : (
          <span className="text-xs text-slate-500">—</span>
        )}
      </td>
      <td className="p-3">
        <input
          aria-label={`Supplier cost ${p.name}`}
          className={inp}
          style={{ width: 100 }}
          inputMode="numeric"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </td>
      <td className="p-3 font-medium text-slate-500">{margin}%</td>
      <td className="p-3">
        {dirty && (
          <button
            type="button"
            className="rounded-lg bg-[#1E3BCB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#18246B]"
            onClick={() =>
              send({
                type: "product.update",
                id: p.id,
                retailPrice: parsedPrice,
                supplierCost: parsedCost,
                originalPrice: parsedOrig > 0 ? parsedOrig : null,
              })
            }
          >
            Save
          </button>
        )}
      </td>
      <td className="p-3">
        <div className="flex gap-1.5">
          <Tg on={p.active} label="Active" onClick={() => send({ type: "product.update", id: p.id, active: !p.active })} />
          <Tg on={p.featured} label="Featured" onClick={() => send({ type: "product.update", id: p.id, featured: !p.featured })} />
          <Tg on={p.popular} label="Popular" onClick={() => send({ type: "product.update", id: p.id, popular: !p.popular })} />
        </div>
      </td>
    </tr>
  );
}

export function ProductsEditor({ games, products }: { games: Game[]; products: Product[] }) {
  const { msg, send } = useSend();
  const [f, setF] = useState({
    gameId: games[0]?.id ?? "",
    name: "",
    denomination: "",
    retailPrice: "",
    originalPrice: "",
    supplierCost: "",
    supplierProductId: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  return (
    <>
      <Msg m={msg} />
      <div className="overflow-x-auto rounded-xl border border-[#E0E5F1] bg-white shadow-sm">
        <table className="w-full min-w-[840px] text-left">
          <thead className="border-b border-[#E0E5F1] bg-[#F4F6FB] text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {["Game", "Product / SKU", "Retail ₦", "Original ₦ (Discount)", "Discount", "Supplier cost ₦", "Margin", "", "Flags"].map((h) => (
                <th key={h} className="p-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <PRow key={p.id} p={p} gname={games.find((g) => g.id === p.gameId)?.name ?? ""} send={send} />
            ))}
          </tbody>
        </table>
      </div>

      <div className={card}>
        <h2 className="mb-1 text-base font-medium text-slate-900">Add Denomination (SKU)</h2>
        <p className="mb-4 text-xs text-slate-500">Configure selling price and optional discount price per denomination.</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Game</label>
            <select aria-label="Game" className={inp} value={f.gameId} onChange={set("gameId")}>
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Denomination Name</label>
            <input aria-label="Name" placeholder="e.g. 500 Diamonds" className={inp} value={f.name} onChange={set("name")} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Numeric Amount</label>
            <input aria-label="Denomination" placeholder="e.g. 500" inputMode="numeric" className={inp} value={f.denomination} onChange={set("denomination")} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Retail Selling Price (₦)</label>
            <input aria-label="Retail price" placeholder="Selling price ₦" inputMode="numeric" className={inp} value={f.retailPrice} onChange={set("retailPrice")} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Original Slashed Price (₦) - Optional</label>
            <input aria-label="Original price" placeholder="e.g. 6000 (shows discount badge)" inputMode="numeric" className={inp} value={f.originalPrice} onChange={set("originalPrice")} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Supplier Cost (₦)</label>
            <input aria-label="Supplier cost" placeholder="Wholesale cost ₦" inputMode="numeric" className={inp} value={f.supplierCost} onChange={set("supplierCost")} />
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <label className="mb-1 block text-xs text-slate-500">Supplier Product SKU</label>
            <input aria-label="Supplier product ID" placeholder="Supplier SKU (e.g. 1001 or free-fire-100)" className={inp} value={f.supplierProductId} onChange={set("supplierProductId")} />
          </div>
        </div>
        <button
          type="button"
          className="mt-4 rounded-xl bg-[#1E3BCB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18246B]"
          onClick={async () => {
            if (
              await send({
                type: "product.add",
                gameId: f.gameId,
                name: f.name,
                denomination: +f.denomination,
                retailPrice: +f.retailPrice,
                originalPrice: f.originalPrice ? +f.originalPrice : undefined,
                supplierCost: +f.supplierCost,
                supplierProductId: f.supplierProductId,
              })
            ) {
              setF({ ...f, name: "", denomination: "", retailPrice: "", originalPrice: "", supplierCost: "", supplierProductId: "" });
            }
          }}
        >
          Add Denomination
        </button>
      </div>
    </>
  );
}

function GRow({ game, send }: { game: Game; send: (b: object) => Promise<boolean> }) {
  const [desc, setDesc] = useState(game.description || "");
  const [imgUrl, setImgUrl] = useState(game.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dirty = desc !== (game.description || "") || imgUrl !== (game.imageUrl || "");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Upload failed");
      setImgUrl(data.url);
      // Auto-save the uploaded image to the game
      await send({ type: "game.update", id: game.id, imageUrl: data.url, description: desc });
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <>
      <tr className="border-t border-[#E0E5F1] text-sm hover:bg-slate-50 transition-colors">
        <td className="p-3 text-slate-500">{game.sortOrder}</td>
        <td className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-[#E0E5F1] bg-slate-100">
              {imgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgUrl} alt={game.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                  No img
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-slate-900">{game.name}</div>
              <div className="text-xs text-slate-500">{game.slug}</div>
            </div>
          </div>
        </td>
        <td className="p-3 text-slate-500">{game.category}</td>
        <td className="p-3 text-slate-500">{game.playerFields[0]?.label}</td>
        <td className="p-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg border border-[#E0E5F1] px-2.5 py-1 text-xs text-slate-500 hover:border-hi hover:text-[#1E3BCB]"
          >
            {expanded ? "Hide Details" : "Edit Image & Description"}
          </button>
        </td>
        <td className="p-3">
          <div className="flex gap-1">
            <button
              type="button"
              aria-label={`Move ${game.name} up`}
              className="rounded border border-[#E0E5F1] px-2 py-0.5 text-xs text-slate-500 hover:border-hi"
              onClick={() => send({ type: "game.update", id: game.id, sortOrder: game.sortOrder - 1 })}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={`Move ${game.name} down`}
              className="rounded border border-[#E0E5F1] px-2 py-0.5 text-xs text-slate-500 hover:border-hi"
              onClick={() => send({ type: "game.update", id: game.id, sortOrder: game.sortOrder + 1 })}
            >
              ↓
            </button>
          </div>
        </td>
        <td className="p-3">
          <div className="flex gap-1.5">
            <Tg
              on={game.active}
              label={game.active ? "Active" : "Hidden"}
              onClick={() => send({ type: "game.update", id: game.id, active: !game.active })}
            />
            <Tg
              on={game.featured}
              label="Featured"
              onClick={() => send({ type: "game.update", id: game.id, featured: !game.featured })}
            />
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-[#E0E5F1] bg-slate-50/50">
          <td colSpan={7} className="p-4">
            <div className="space-y-4 rounded-xl border border-[#E0E5F1] bg-[#F8FAFC] p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-900">Game Image / Banner</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#E0E5F1] bg-white shadow-sm">
                      {imgUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgUrl} alt={game.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                          None
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg border border-[#E0E5F1] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                        >
                          {uploading ? "Uploading..." : "Upload Image File"}
                        </button>
                        {imgUrl && (
                          <button
                            type="button"
                            onClick={() => setImgUrl("")}
                            className="text-xs text-red-500 hover:underline font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        placeholder="Or paste image URL (https://... or /uploads/...)"
                        className={inp}
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  {uploadErr && <p className="mt-1 text-xs text-red-500 font-medium">{uploadErr}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-900">Customer Game Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description shown to customers on the top-up page..."
                    className={inp}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600 font-medium">
                  Uploaded images display on the home game cards and detail top-up page.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDesc(game.description || "");
                      setImgUrl(game.imageUrl || "");
                      setExpanded(false);
                    }}
                    className="rounded-lg border border-[#E0E5F1] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!dirty}
                    onClick={async () => {
                      await send({ type: "game.update", id: game.id, description: desc, imageUrl: imgUrl || undefined });
                    }}
                    className="rounded-lg bg-[#1E3BCB] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#18246B] disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function GamesEditor({ games }: { games: Game[] }) {
  const { msg, send } = useSend();
  const [f, setF] = useState({
    name: "",
    slug: "",
    category: "Football",
    fieldLabel: "Player ID",
    description: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const addFileRef = useRef<HTMLInputElement>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function handleAddImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.ok) {
        setF((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Msg m={msg} />
      <div className="overflow-x-auto rounded-xl border border-[#E0E5F1] bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left">
          <thead className="border-b border-[#E0E5F1] bg-[#F4F6FB] text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {["#", "Game & Image", "Category", "ID field", "Image & Description", "Sort", "Flags"].map((h) => (
                <th key={h} className="p-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <GRow key={g.id} game={g} send={send} />
            ))}
          </tbody>
        </table>
      </div>

      <div className={card}>
        <h2 className="mb-1 text-base font-medium text-slate-900">Add New Game</h2>
        <p className="mb-4 text-xs text-slate-500">Create a new game with its player identification field, artwork and description.</p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Game Name</label>
            <input aria-label="Game name" placeholder="e.g. Free Fire" className={inp} value={f.name} onChange={set("name")} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">URL Slug (optional)</label>
            <input aria-label="Slug" placeholder="e.g. free-fire" className={inp} value={f.slug} onChange={set("slug")} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Category</label>
            <select aria-label="Category" className={inp} value={f.category} onChange={set("category")}>
              {["Football", "Battle Royale", "FPS", "Mobile Games"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Player ID Field Label</label>
            <input aria-label="Player ID field label" placeholder="Player ID / UID" className={inp} value={f.fieldLabel} onChange={set("fieldLabel")} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-slate-500">Game Image (File or URL)</label>
            <div className="flex gap-2">
              <input
                ref={addFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAddImageUpload}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => addFileRef.current?.click()}
                className="whitespace-nowrap rounded-lg border border-[#E0E5F1] bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
              <input
                aria-label="Image URL"
                placeholder="Image URL (optional)"
                className={inp}
                value={f.imageUrl}
                onChange={set("imageUrl")}
              />
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <label className="mb-1 block text-xs text-slate-500">Customer Description</label>
            <input
              aria-label="Description"
              placeholder="Short game description displayed to customers"
              className={inp}
              value={f.description}
              onChange={set("description")}
            />
          </div>
        </div>
        <button
          type="button"
          className="mt-4 rounded-xl bg-[#1E3BCB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18246B]"
          onClick={async () => {
            if (
              await send({
                type: "game.add",
                name: f.name,
                category: f.category,
                fieldLabel: f.fieldLabel,
                slug: f.slug || undefined,
                description: f.description || undefined,
                imageUrl: f.imageUrl || undefined,
              })
            ) {
              setF({ name: "", slug: "", category: "Football", fieldLabel: "Player ID", description: "", imageUrl: "" });
            }
          }}
        >
          Add Game
        </button>
        <p className="mt-2 text-xs text-slate-500">
          New games stay hidden until they have an active denomination and you enable them.
        </p>
      </div>
    </>
  );
}
