import { getPaymentProvider } from "@/lib/providers/payment";
export const paymentService = { initialize: (i: { orderId: string; amount: number; email: string }) => getPaymentProvider().initializePayment(i), verify: (ref: string) => getPaymentProvider().verifyPayment(ref), refund: (ref: string) => getPaymentProvider().refundPayment(ref) };
