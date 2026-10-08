import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Shop2topupExplorer } from "@/components/Shop2topupExplorer";

export const metadata = {
  title: "Shop2topup Supplier API & Catalogue Import",
};

export default function Shop2topupAdminPage() {
  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/admin/suppliers" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1E3BCB] mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Suppliers
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shop2topup Reseller Integration</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse live wholesale games and denominations directly from Shop2topup, inspect required player fields, set your profit margins, and import products into Zenaload with one click.
        </p>
      </div>

      <Shop2topupExplorer />
    </div>
  );
}
