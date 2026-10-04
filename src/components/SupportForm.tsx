"use client";

import { useState } from "react";

export function SupportForm() {
  const [f, setF] = useState({ email: "", orderId: "", message: "" });
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, orderId: f.orderId ? f.orderId.trim() : undefined }),
      });
      const j = await r.json();
      if (r.ok) {
        setDone(j.ticketId);
      } else {
        setMsg(j.error || "Unable to submit ticket");
      }
    } catch {
      setMsg("Network connection error. Please try again.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 text-2xl border border-emerald-500/30">
          ✓
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Ticket Submitted</h3>
          <p className="mt-1 text-xs sm:text-sm text-ink2 leading-relaxed">
            Your support ticket has been registered with reference ID:
          </p>
          <div className="mt-3 inline-block rounded-xl border border-emerald-500/30 bg-bg2/80 px-4 py-2 font-mono text-sm font-bold text-emerald-300">
            {done}
          </div>
          <p className="mt-3 text-xs text-mute">
            We will review your inquiry and reply via email to <strong className="text-white">{f.email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={send}
      className="rounded-3xl border border-white/10 bg-card/75 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4"
    >
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white">Submit a Support Ticket</h3>
        <p className="text-xs text-mute mt-1">
          For order questions, billing inquiries, or general help.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink2 mb-1.5">
          Email Address <span className="text-brand">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="your.email@example.com"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-bg2/90 px-4 py-3 text-sm text-white placeholder-mute transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink2 mb-1.5">
          Order ID <span className="text-mute font-normal lowercase">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. ZL-20261004-9F3A1C7E"
          value={f.orderId}
          onChange={(e) => setF({ ...f, orderId: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-bg2/90 px-4 py-3 font-mono text-sm text-white placeholder-mute transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand uppercase"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink2 mb-1.5">
          Message <span className="text-brand">*</span>
        </label>
        <textarea
          rows={4}
          required
          placeholder="Describe what you need help with..."
          value={f.message}
          onChange={(e) => setF({ ...f, message: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-bg2/90 px-4 py-3 text-sm text-white placeholder-mute transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      {msg && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400"
        >
          {msg}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-gradient-to-r from-brand to-brand2 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
      >
        {busy ? "Submitting Ticket…" : "Send Message &rarr;"}
      </button>
    </form>
  );
}
