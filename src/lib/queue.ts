// Queue abstraction. In-process with exponential backoff for the prototype; swap for Inngest/BullMQ (same enqueue/register API)
// so retries survive restarts and serverless limits.
type Data = { orderId: string };
type Handler = (d: Data) => Promise<void>;
const handlers = new Map<string, { run: Handler; onDead: (d: Data, e: unknown) => Promise<void> | void }>();
const MAX_ATTEMPTS = 4;
async function run(name: string, d: Data, attempt: number): Promise<void> {
  const h = handlers.get(name); if (!h) throw new Error(`No handler for ${name}`);
  try { await h.run(d); }
  catch (e) { if (attempt >= MAX_ATTEMPTS) return void (await h.onDead(d, e)); setTimeout(() => void run(name, d, attempt + 1), 2 ** attempt * 1000); }
}
export const queue = {
  register: (name: string, run: Handler, onDead: (d: Data, e: unknown) => Promise<void> | void) => void handlers.set(name, { run, onDead }),
  enqueue: (name: string, d: Data) => void setTimeout(() => void run(name, d, 1), 0),
};
