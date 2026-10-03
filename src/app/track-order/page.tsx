"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Track() { const [id, setId] = useState(""); const r = useRouter(); return (<div className="max-w-md"><h1 className="mb-4 text-3xl font-semibold">Track Order</h1><input aria-label="Order ID" className="w-full rounded-xl border border-line bg-bg2 px-3 py-3" placeholder="ZL-20261003-9F3A1C7E" value={id} onChange={(e) => setId(e.target.value)} /><button className="mt-3 w-full rounded-xl bg-brand py-3" onClick={() => id && r.push(`/orders/${id.trim().toUpperCase()}`)}>Track Order</button></div>); }
