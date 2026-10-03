import { sql } from "@/lib/db";
import { memoryCatalog } from "./catalogStore.memory";
import { pgCatalog } from "./catalogStore.pg";
export const catalogStore = sql ? pgCatalog : memoryCatalog; // Postgres needs `npm run seed` once
