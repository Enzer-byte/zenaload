import { sql, isDbActive, markDbFailed } from "@/lib/db";
const g = globalThis as unknown as { __wh?: Set<string> };
const seen: Set<string> = (g.__wh ??= new Set());
export const webhookEvents = {
  // false = duplicate. Postgres: the unique (provider,event_id) key is the idempotency lock.
  async recordOnce(provider: string, eventId: string) {
    if (isDbActive() && sql) {
      try {
        return (await sql`insert into webhook_events (provider, event_id) values (${provider}, ${eventId}) on conflict do nothing returning id`).length > 0;
      } catch (e) {
        markDbFailed(e);
      }
    }
    const k = `${provider}:${eventId}`; if (seen.has(k)) return false; seen.add(k); return true;
  },
};

