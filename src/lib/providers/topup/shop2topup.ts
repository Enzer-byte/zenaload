import type { TopupProvider } from "@/types";
import { real, supplierRequest } from "./http";
import { createHash, randomUUID } from "crypto";

export const isShop2topupConfigured = () =>
  real(process.env.SHOP2TOPUP_KEY_ID) && real(process.env.SHOP2TOPUP_KEY_SECRET);

const BASE_URL = process.env.SHOP2TOPUP_API_BASE ?? "https://shop2topup.com/api/endpoints/v1";

const getAuthHeader = () => {
  const keyId = process.env.SHOP2TOPUP_KEY_ID?.trim();
  const secret = process.env.SHOP2TOPUP_KEY_SECRET?.trim();
  return `Bearer ${keyId}.${secret}`;
};

export async function shop2topupRequest<T>(endpoint: string, options: { method?: "GET" | "POST"; body?: unknown } = {}): Promise<T> {
  return supplierRequest<T>({
    configured: isShop2topupConfigured(),
    name: "Shop2topup",
    url: `${BASE_URL}${endpoint}`,
    method: options.method,
    headers: {
      Authorization: getAuthHeader(),
    },
    body: options.body,
  });
}

export interface Shop2topupAccount {
  email: string;
  wallet: string;
}

export interface Shop2topupBigCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Shop2topupCategory {
  id: number;
  name: string;
  description?: string | null;
  big_category_id: number;
  big_category_name?: string;
  requirements?: string | Record<string, unknown>;
}

export interface Shop2topupSubcategory {
  id: number;
  item_id: number;
  name: string;
  description?: string | null;
  category_id: number;
  category_name: string;
  fulfillment_type: string;
  returns_voucher: boolean;
  product_type: string;
  price: number;
}

export interface Shop2topupRequirement {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
  help?: string;
  options?: { label: string; value: string }[];
}

// Convert arbitrary order reference (e.g. ZL-20261004-ABCD1234) to RFC 4122 UUID v4
// Shop2topup requires order_id to strictly match UUID regex ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
export function toShop2topupOrderId(idempotencyKey: string): string {
  // If already a valid UUID, keep it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    return idempotencyKey.toLowerCase();
  }
  // Deterministically create a valid UUID v4 formatted hex string from the order key
  const hex = createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export const Shop2topupProvider: TopupProvider = {
  id: "shop2topup",

  async getProducts() {
    try {
      const res = await shop2topupRequest<{ success: boolean; data: Shop2topupSubcategory[] }>("/catalog/subcategories");
      return (res?.data || []).map((item) => ({
        supplierProductId: String(item.id),
        name: `${item.category_name} - ${item.name}`,
        cost: item.price || 0,
      }));
    } catch {
      return [];
    }
  },

  async validatePlayer(gameId: string, fields: Record<string, string>): Promise<boolean> {
    // If not configured, mock or accept standard player fields
    if (!isShop2topupConfigured()) {
      return Object.values(fields).length > 0 && Object.values(fields).every((v) => Boolean(v && v.trim()));
    }

    try {
      // Find categoryId if numeric or passed
      const categoryId = Number(gameId);
      if (isNaN(categoryId)) return true; // Can't validate without category ID; allow checkout to proceed

      const playerId = fields.player_id ?? fields.playerId ?? Object.values(fields)[0];
      if (!playerId) return false;

      const body: Record<string, unknown> = {
        category_id: categoryId,
        player_id: playerId,
      };
      if (fields.zone_id ?? fields.zoneId) body.zone_id = fields.zone_id ?? fields.zoneId;
      if (fields.server) body.server = fields.server;

      const res = await shop2topupRequest<{ valid: boolean; player_name?: string }>("/player/validate", {
        method: "POST",
        body,
      });
      return !!res.valid;
    } catch {
      // If validation endpoint fails or game doesn't support validation, allow through
      return true;
    }
  },

  async createTopup({ idempotencyKey, supplierProductId, fields }) {
    const orderUuid = toShop2topupOrderId(idempotencyKey);
    const subCategoryId = parseInt(supplierProductId, 10);

    // Get expected unit price to protect against price spikes
    let expectedPrice = "0.00";
    try {
      const priceRes = await shop2topupRequest<{ unit_price: string }>(`/catalog/subcategory/${subCategoryId}/price`);
      if (priceRes?.unit_price) expectedPrice = priceRes.unit_price;
    } catch {
      // Continue with order creation even if price lookup fails
    }

    const payload = {
      order_id: orderUuid,
      sub_category_id: subCategoryId,
      quantity: 1,
      requirements: fields,
      expected_unit_price: expectedPrice,
    };

    const res = await shop2topupRequest<{
      order_id: string;
      status: "pending" | "completed" | "partial" | "refunded";
      message?: string;
    }>("/orders/create", {
      method: "POST",
      body: payload,
    });

    const statusMap: Record<string, "SUCCESSFUL" | "PENDING" | "FAILED"> = {
      completed: "SUCCESSFUL",
      pending: "PENDING",
      partial: "PENDING",
      refunded: "FAILED",
    };

    return {
      txId: res.order_id || orderUuid,
      status: statusMap[res.status] ?? "PENDING",
      message: res.message,
    };
  },

  async getTransactionStatus(txId: string): Promise<"SUCCESSFUL" | "PENDING" | "FAILED"> {
    const res = await shop2topupRequest<{
      order: {
        order_id: string;
        status: "pending" | "completed" | "partial" | "refunded";
      };
    }>(`/orders/${txId}`);

    const s = res?.order?.status;
    if (s === "completed") return "SUCCESSFUL";
    if (s === "refunded") return "FAILED";
    return "PENDING";
  },

  async refundTransaction(_txId: string): Promise<boolean> {
    // Shop2topup handles refunds automatically if top-up fails
    return false;
  },

  async getBalance(): Promise<number> {
    const res = await shop2topupRequest<{ account: Shop2topupAccount }>("/account");
    return parseFloat(res?.account?.wallet ?? "0");
  },
};
