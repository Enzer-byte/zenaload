"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const r = useRouter(); const [pw, setPw] = useState(""), [err, setErr] = useState("");
  async function go() { const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password: pw }) }); if (res.ok) r.push("/admin"); else setErr((await res.json()).error); }
  return (<div className="max-w-sm"><h1 className="mb-4 text-2xl font-semibold">Admin sign in</h1><label className="block text-sm text-ink2">Password<input type="password" className="mt-1 w-full rounded-xl border border-line bg-bg2 px-3 py-3" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} /></label>{err && <p role="alert" className="mt-2 text-sm text-red-500">{err}</p>}<button onClick={go} className="mt-4 w-full rounded-xl bg-brand py-3">Sign in</button></div>);
}
