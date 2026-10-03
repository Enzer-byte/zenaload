// In-memory sliding window. On serverless (Vercel) use Upstash/Redis instead so limits hold across instances.
const hits = new Map<string, number[]>();
const live = (k: string, w: number) => { const n = Date.now(), l = (hits.get(k) ?? []).filter((t) => n - t < w); hits.set(k, l); return l; };
export const limited = (key: string, max: number, windowMs: number) => live(key, windowMs).length >= max;
export const record = (key: string, windowMs: number) => live(key, windowMs).push(Date.now());
export const clearLimit = (key: string) => void hits.delete(key);
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
