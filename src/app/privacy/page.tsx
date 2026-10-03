import { LegalPage, type Section } from "@/components/LegalPage";
import { config } from "@/config";
export const metadata = { title: "Privacy Policy" };
const L = config.legal, B = config.brand;
const sections: Section[] = [
  ["Who we are", [`${L.companyName} (RC ${L.rcNumber}), ${L.address}, operates ${B} and is responsible for your personal data. Contact: ${config.supportEmail}. Data protection contact: [NAME / DPO CONTACT].`]],
  ["What we collect", ["Order details: the game, product, Player ID, amount, order reference and order history.", "Contact details: email, phone and optional WhatsApp number that you give at checkout or on the support form, plus the messages you send us.", "Payment references from our payment provider. We do not receive or store your full card details.", "Basic technical data (such as IP address and device type) used for security and to prevent abuse."]],
  ["How we use it", ["To take payment, deliver your top-up, show order status and send order updates; to give support and handle refunds; to prevent fraud and abuse; and to meet legal and accounting duties."]],
  ["Our lawful basis", ["We process your data to perform our contract with you, to comply with the law, for our legitimate interests in security and fraud prevention, and with your consent where we ask for it (for example optional WhatsApp updates). [LAWYER TO CONFIRM FOR THE NIGERIA DATA PROTECTION ACT 2023]"]],
  ["Who we share it with", ["Only the services we need to run the platform: payment providers (to take payment), top-up suppliers (they receive the Player ID and product to deliver the top-up), hosting and database providers, and email or WhatsApp messaging providers. We may disclose data to authorities when legally required. We do not sell your personal data."]],
  ["Data stored on your device", ["To remember your recent orders, saved Player IDs and recent searches, we store small items in your browser's local storage on your device. You can clear them in your browser settings. We do not currently use advertising or analytics cookies. [UPDATE IF YOU ADD ANALYTICS]"]],
  ["How long we keep it", [`We keep order and payment records for as long as needed for refunds, disputes, accounting and legal duties: [RETENTION PERIOD, e.g. 6 years]. Support messages are kept for [PERIOD]. We then delete or anonymise them.`]],
  ["Security", ["We use access controls, encrypted connections and limit who can see order data. Order pages show only partly hidden contact and Player ID details. No system is perfectly secure, and we will notify you and the regulator where the law requires after a breach."]],
  ["Your rights", ["Under Nigerian data protection law you can ask to access, correct or delete your data, object to or restrict certain processing, withdraw consent, and complain to the Nigeria Data Protection Commission. Contact us and we will respond within the time the law requires. We may need to keep some records for legal reasons."]],
  ["Transfers outside Nigeria", ["Some of our providers (for example hosting) may process data outside Nigeria. We use providers that protect data to an appropriate standard. [LIST PROVIDERS AND COUNTRIES BEFORE LAUNCH]"]],
  ["Children", [`${B} is not directed at children under [AGE, e.g. 13]. If you are under 18, buy only with a parent or guardian's permission. Contact us if you think a child gave us data without permission.`]],
  ["Changes", ["We will post changes here and update the effective date. Material changes will be highlighted."]],
];
export default function Privacy() { return <LegalPage title="Privacy Policy" intro={`How ${B} collects, uses and protects your personal data.`} sections={sections} />; }
