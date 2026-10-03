import { LegalPage, type Section } from "@/components/LegalPage";
import { config } from "@/config";
export const metadata = { title: "Terms of Service" };
const L = config.legal, B = config.brand;
const sections: Section[] = [
  ["Who we are", [`${B} is operated by ${L.companyName} (RC ${L.rcNumber}), ${L.address} ("we", "us"). We sell digital game credits and top-ups to customers in Nigeria, priced in Nigerian Naira (₦).`]],
  ["Using the service", ["You don't need an account to buy. By placing an order you confirm you are old enough to enter a binding contract, or that a parent or guardian has agreed to the purchase. You must give accurate contact details.", "We may refuse or cancel an order if we suspect fraud, abuse or an error in pricing or availability. If we cancel a paid order, we refund it."]],
  ["Orders and prices", ["Prices are shown in ₦ at checkout and are the price you pay for that order. Prices can change, but a change never affects an order you have already paid for. An order is confirmed when your payment is confirmed by our payment provider."]],
  ["Payment", ["Payments are processed by third-party payment providers (such as Paystack or Flutterwave). We do not see or store your full card details. Your payment is subject to your provider's terms. We only deliver a top-up after the provider confirms your payment."]],
  ["Delivery", ["Most top-ups are delivered within minutes, but delivery depends on the game publisher and our suppliers and is not guaranteed to be instant. Your order page shows the live status. If delivery is delayed, your order stays safe and we will deliver it or refund you."]],
  ["Your Player ID", ["You are responsible for entering the correct Player ID (or UID). Top-ups are delivered to the ID you enter and generally cannot be reversed or moved. Check it carefully before paying. See our Refund Policy for what we can do if you made a mistake."]],
  ["Refunds", ["Refunds are covered in our Refund Policy, which forms part of these Terms."]],
  ["Acceptable use", ["Do not use the service for fraud, to pay with payment methods you aren't authorised to use, to resell in breach of the game publisher's rules, to attack or overload the site, or to break any law. We may suspend access for breaches."]],
  ["Games and trademarks", [`${B} is not affiliated with, endorsed by or sponsored by any game publisher. Game names and marks belong to their owners and are used only to identify the product you are buying. You must follow each game's own terms of service.`]],
  ["Our liability", ["We are responsible for delivering what you paid for or refunding you. To the extent the law allows, we are not liable for indirect or consequential loss, for game-account actions taken by a publisher, or for delays caused by payment providers, publishers or networks outside our control. Nothing in these Terms limits rights you have under Nigerian consumer protection law that cannot be excluded. [LAWYER TO REVIEW THIS SECTION]"]],
  ["Changes and availability", ["We may change the service, products or these Terms. The version published when you order applies to that order. We aim for the site to be available at all times but cannot promise it will never be interrupted."]],
  ["Governing law", [`These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the courts of ${L.courtCity}, Nigeria, unless the law gives you the right to go elsewhere.`]],
  ["Contact", [`Questions or complaints: ${config.supportEmail}, or use our support page. Please include your Order ID.`]],
];
export default function Terms() { return <LegalPage title="Terms of Service" intro={`These Terms apply when you use ${B} and buy from us. Please read them before you pay.`} sections={sections} />; }
