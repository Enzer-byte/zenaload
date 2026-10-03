import { OrderStatus } from "@/components/OrderStatus";
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) { return <OrderStatus id={(await params).id} />; }
