import postgres from "postgres";

// Global cache for connection and failure flag across hot reloads
const g = globalThis as unknown as {
  __sql?: ReturnType<typeof postgres>;
  __dbFailed?: boolean;
};

const url = process.env.DATABASE_URL;

export const sql =
  url && !url.includes("REPLACE_ME")
    ? (g.__sql ??= postgres(url, {
        prepare: false,
        max: 5,
        connect_timeout: 3,
        ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require",
      }))
    : null;

export function isDbActive(): boolean {
  return Boolean(sql && !g.__dbFailed);
}

export function markDbFailed(err?: unknown): void {
  if (!g.__dbFailed) {
    console.warn(
      "[db] Postgres connection/query failed. Falling back repositories to in-memory mode:",
      (err as Error)?.message || err
    );
    g.__dbFailed = true;
  }
}

