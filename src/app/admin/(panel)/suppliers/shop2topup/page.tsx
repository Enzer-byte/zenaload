import { Shop2topupExplorer } from "@/components/Shop2topupExplorer";

export const metadata = {
  title: "Shop2topup Supplier API & Catalogue Import",
};

export default function Shop2topupAdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Shop2topup Reseller Integration</h1>
        <p className="mt-1 text-sm text-mute">
          Browse live wholesale games and denominations directly from Shop2topup, inspect required player fields, set your profit margins, and import products into Zenaload with one click.
        </p>
      </div>

      <Shop2topupExplorer />
    </div>
  );
}
