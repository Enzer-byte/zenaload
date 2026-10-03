"use client";
import { useState } from "react";
export function SupportForm() {
  const [f, setF] = useState({ email: "", orderId: "", message: "" }), [msg, setMsg] = useState(""), [done, setDone] = useState(""), [busy, setBusy] = useState(false);
  async function send() { setBusy(true); setMsg(""); try { const r = await fetch("/api/support", { method: "POST", body: JSON.stringify({ ...f, orderId: f.orderId || undefined }) }), j = await r.json(); if (r.ok) setDone(j.ticketId); else setMsg(j.error); } catch { setMsg("Network problem. Please try again."); } setBusy(false); }
  if (done) return <div className="rounded-2xl border border-line bg-card p-6"><h2 className="text-xl font-semibold text-green-400">Message received</h2><p className="mt-1 text-ink2">Your reference is {done}. We'll reply by email.</p></div>;
  const inp = "mt-1 w-full rounded-xl border border-line bg-bg2 px-3 py-3";
  return (<div className="max-w-md space-y-3 rounded-2xl border border-line bg-card p-5"><label className="block text-sm text-ink2">Email<input type="email" className={inp} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label><label className="block text-sm text-ink2">Order ID (optional)<input className={inp} value={f.orderId} onChange={(e) => setF({ ...f, orderId: e.target.value })} /></label><label className="block text-sm text-ink2">How can we help?<textarea rows={4} className={inp} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>{msg && <p role="alert" className="text-sm text-red-500">{msg}</p>}<button disabled={busy} onClick={send} className="w-full rounded-xl bg-brand py-3 disabled:opacity-50">{busy ? "Sending…" : "Send message"}</button></div>);
}
