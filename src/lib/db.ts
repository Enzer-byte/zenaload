import postgres from "postgres";
// Set DATABASE_URL (Supabase pooler or direct string) to switch every repository from memory to Postgres.
const g = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };
const url = process.env.DATABASE_URL;
export const sql = url ? (g.__sql ??= postgres(url, { prepare: false, max: 5, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require" })) : null;
