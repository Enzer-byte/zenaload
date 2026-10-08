"use client";
import { useRouter } from "next/navigation";
export function OpsButton({ action, id, label }: { action: "readAll" | "resolve" | "reopen"; id?: string; label: string }) {
  const r = useRouter();
  return (
    <button 
      className="rounded-lg border border-[#E0E5F1] bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm" 
      onClick={async () => { 
        await fetch("/api/admin/ops", { method: "POST", body: JSON.stringify({ action, id }) }); 
        r.refresh(); 
      }}
    >
      {label}
    </button>
  );
}
