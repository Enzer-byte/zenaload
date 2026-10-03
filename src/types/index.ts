export type PaymentStatus = "UNPAID" | "PAYMENT_PENDING" | "PAID" | "PAYMENT_FAILED" | "REFUNDED";
export type FulfillmentStatus = "NOT_STARTED" | "PROCESSING" | "SUCCESSFUL" | "FAILED" | "PENDING_REVIEW";
export interface PlayerField { key: string; label: string; pattern?: string; help: string }
export interface Game { id: string; slug: string; name: string; category: string; description: string; playerFields: PlayerField[]; supplierId: string; active: boolean; featured: boolean; sortOrder: number }
export interface Product { id: string; gameId: string; name: string; denomination: number; currency: "NGN"; retailPrice: number; supplierCost: number; supplierProductId: string; active: boolean; featured?: boolean; popular?: boolean }
export interface Order {
  id: string; gameId: string; productId: string; playerFields: Record<string, string>;
  customer: { email: string; phone: string; whatsapp?: string };
  amount: number; currency: "NGN"; payment: PaymentStatus; fulfillment: FulfillmentStatus;
  paymentRef?: string; supplierTxId?: string; errorMessage?: string; retryCount?: number; paymentUrl?: string;
  createdAt: string; updatedAt: string; events: { at: string; label: string }[];
}
export interface PaymentProvider {
  id: string;
  initializePayment(i: { orderId: string; amount: number; email: string }): Promise<{ reference: string; status: "PAID" | "PENDING" | "FAILED"; redirectUrl?: string }>;
  verifyPayment(reference: string): Promise<boolean>;
  handleWebhook(payload: unknown, signature: string | null): Promise<{ reference: string; paid: boolean } | null>;
  refundPayment(reference: string): Promise<boolean>;
  getTransaction(reference: string): Promise<unknown>;
}
export interface TopupProvider {
  id: string;
  getProducts(): Promise<{ supplierProductId: string; name: string; cost: number }[]>;
  validatePlayer(gameId: string, fields: Record<string, string>): Promise<boolean>;
  createTopup(i: { idempotencyKey: string; supplierProductId: string; fields: Record<string, string> }): Promise<{ txId: string; status: "SUCCESSFUL" | "PENDING" | "FAILED"; message?: string }>;
  getTransactionStatus(txId: string): Promise<"SUCCESSFUL" | "PENDING" | "FAILED">;
  refundTransaction(txId: string): Promise<boolean>;
  getBalance(): Promise<number>;
}
export interface OrderStore {
  get(id: string): Promise<Order | null>;
  getByPaymentRef(ref: string): Promise<Order | null>;
  create(o: Order): Promise<void>;
  save(o: Order): Promise<void>; // persists mutable fields + any new events
  claimPaid(ref: string, label: string): Promise<Order | null>; // atomic PAYMENT_PENDING -> PAID; null if someone else already did it
  withLock(id: string, fn: (o: Order) => Promise<void>): Promise<void>; // one worker per order; skips if locked
  list(limit?: number): Promise<Order[]>; // newest first (admin)
}
export interface CatalogStore {
  games(): Promise<Game[]>; products(): Promise<Product[]>;
  saveGame(g: Game): Promise<void>; saveProduct(p: Product): Promise<void>; // upserts
}
export interface Ticket { id: string; orderId?: string; email: string; subject: string; message: string; open: boolean; createdAt: string }
export interface Notice { id: string; level: "info" | "warn" | "error"; title: string; detail: string; orderId?: string; read: boolean; createdAt: string }
export interface OpsStore {
  addTicket(t: Ticket): Promise<void>; tickets(): Promise<Ticket[]>; setTicketOpen(id: string, open: boolean): Promise<void>;
  addNotice(n: Notice): Promise<void>; notices(): Promise<Notice[]>; readAll(): Promise<void>;
}
