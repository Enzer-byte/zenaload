import { config } from "@/config";
import { SupportForm } from "@/components/SupportForm";
export const metadata = { title: "Support", description: "Get help with an order." };
export default function Support() { return (<><h1 className="mb-2 text-3xl font-semibold">Support</h1><p className="mb-6 text-ink2">Fastest: <a className="text-hi" href={`https://wa.me/${config.whatsapp}`}>WhatsApp</a>. Or email {config.supportEmail}, or send a message below with your Order ID.</p><SupportForm /></>); }
