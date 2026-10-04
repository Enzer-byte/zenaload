"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const r = useRouter(); const [pw, setPw] = useState(""), [err, setErr] = useState("");
  async function go() { const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) }); if (res.ok) r.push("/admin"); else setErr((await res.json()).error); }
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-card p-6 sm:p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand2 text-white shadow-lg shadow-brand/25">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Admin Console</h1>
          <p className="mt-1 text-xs text-mute">Authorized operators only</p>
        </div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink2">
          Master Password
          <input
            type="password"
            autoFocus
            className="mt-2 w-full rounded-xl border border-line bg-bg2 px-3.5 py-3 text-sm text-ink placeholder:text-mute focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Enter admin password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
          />
        </label>
        {err && (
          <p role="alert" className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
            {err}
          </p>
        )}
        <button
          onClick={go}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand to-brand2 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:brightness-110 active:scale-[0.99]"
        >
          Sign In to Console
        </button>
      </div>
    </div>
  );
}
