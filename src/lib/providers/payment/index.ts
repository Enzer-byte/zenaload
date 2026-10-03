import { config } from "@/config";
import { MockPaymentProvider } from "./mock";
import { PaystackProvider } from "./paystack";
// Add FlutterwaveProvider here later. UI and services only ever see PaymentProvider.
export const getPaymentProvider = () => (config.paymentProvider === "paystack" ? PaystackProvider : MockPaymentProvider);
