"use client";
import { useRouter } from "next/navigation";
export function OpsButton({ action, id, label }: { action: "readAll" | "resolve" | "reopen"; id?: string; label: string }) {
  const r = useRouter();
  return <button className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-hi" onClick={async () => { await fetch("/api/admin/ops", { method: "POST", body: JSON.stringify({ action, id }) }); r.refresh(); }}>{label}</button>;
}
