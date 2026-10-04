import fs from "fs";
import path from "path";
import { sql } from "../src/lib/db";

async function runMigrations() {
  if (!sql) {
    throw new Error("DATABASE_URL is not set or invalid in environment.");
  }

  console.log("Connecting to Supabase PostgreSQL...");

  const migrationFiles = [
    "001_init.sql",
    "002_ops.sql",
    "003_game_images_and_discounts.sql",
  ];

  for (const filename of migrationFiles) {
    const filePath = path.join(__dirname, "../supabase/migrations", filename);
    console.log(`Applying migration: ${filename}...`);
    const sqlContent = fs.readFileSync(filePath, "utf-8");

    try {
      await sql.unsafe(sqlContent);
      console.log(`✓ Successfully applied: ${filename}`);
    } catch (err: unknown) {
      // If enum or table already exists, log and proceed if safe
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        console.log(`ℹ Notice: Some objects in ${filename} already exist, continuing...`);
      } else {
        console.error(`✗ Error applying ${filename}:`, err);
        throw err;
      }
    }
  }

  console.log("All migrations applied successfully!");
  await sql.end();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
