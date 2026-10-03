"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function OrderActions({ id }: { id: string }) {
  const r = useRouter(); const [armed, setArmed] = useState(""), [msg, setMsg] = useState(""), [note, setNote] = useState(""), [busy, setBusy] = useState(false);
  async function run(action: string) {
    if ((action === "retry" || action === "refund") && armed !== action) { setArmed(action); setMsg(`Click again to confirm ${action}.`); return; } // second click = confirmation
    setArmed(""); setBusy(true);
    const res = await fetch(`/api/admin/orders/${id}`, { method: "POST", body: JSON.stringify({ action, note }) }).then((x) => x.json()).catch(() => ({ message: "Network error. Try again." }));
    setBusy(false); setMsg(res.message); if (res.ok) { setNote(""); r.refresh(); }
  }
  const b = "rounded-xl border border-line px-4 py-2.5 text-left disabled:opacity-50";
  return (<div className="rounded-2xl border border-line bg-card p-5"><h2 className="mb-3 font-medium">Actions</h2><div className="flex flex-col gap-2"><button disabled={busy} className={`${b} ${armed === "retry" ? "border-brand" : ""}`} onClick={() => run("retry")}>{armed === "retry" ? "Confirm retry fulfilment" : "Retry Fulfillment"}</button><button disabled={busy} className={b} onClick={() => run("review")}>Mark for Review</button><button disabled={busy} className={`${b} ${armed === "refund" ? "border-red-500" : ""}`} onClick={() => run("refund")}>{armed === "refund" ? "Confirm refund" : "Refund"}</button></div>
  <textarea aria-label="Internal note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" className="mt-3 w-full rounded-xl border border-line bg-bg2 p-3" /><button disabled={busy} className={`${b} mt-2`} onClick={() => run("note")}>Save note</button>
  {msg && <p role="status" className="mt-3 text-sm text-amber-300">{msg}</p>}<p className="mt-2 text-xs text-mute">Retry is blocked for delivered or unpaid orders, and an existing supplier reference is status-checked instead of re-created.</p></div>);
}
