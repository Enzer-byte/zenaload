import { LegalPage, type Section } from "@/components/LegalPage";
import { config } from "@/config";
export const metadata = { title: "Refund Policy" };
const L = config.legal;
const sections: Section[] = [
  ["Summary", ["If we can't deliver the top-up you paid for, you get your money back. Once a top-up has been delivered to a game account it cannot be reversed, so it is not refundable."]],
  ["When you get a refund", ["Your payment was taken but the top-up failed, was rejected by the supplier or game, or could not be delivered after we tried.", "Your order stays stuck in review and we can't complete it.", "You were charged more than once for the same order, or charged but no order was created.", "We cancel your order (for example because a product became unavailable)."]],
  ["When we can't refund", ["The top-up was delivered to the Player ID you entered, including when that ID was entered incorrectly.", "You changed your mind after delivery.", "A game publisher takes action on your game account."]],
  ["Entered the wrong Player ID?", ["Contact support straight away with your Order ID. We will ask the supplier to help, but we can't guarantee recovery because delivered credits are usually final. Check your ID before paying."]],
  ["Charged but no order?", ["If your bank or card shows a charge but you have no Order ID, contact support with the payment reference or a screenshot. We will find the payment and either complete the order or refund you."]],
  ["How to ask for a refund", ["Go to Support or message us on WhatsApp with your Order ID and the email used at checkout. We reply by email."]],
  ["How long refunds take", [`We process approved refunds within ${L.refundDays} business days. Refunds go back to your original payment method through our payment provider. After we process it, your bank or card issuer may take extra time to show the money.`]],
  ["Disputes", ["Please contact us before raising a chargeback with your bank so we can fix the problem faster. We may suspend accounts or orders linked to abusive chargebacks."]],
];
export default function Refund() { return <LegalPage title="Refund Policy" intro="This policy explains when we refund an order and how to ask." sections={sections} />; }
