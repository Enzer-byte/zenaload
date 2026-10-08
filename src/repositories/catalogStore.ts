import { sql, isDbActive, markDbFailed } from "@/lib/db";
import { memoryCatalog } from "./catalogStore.memory";
import { pgCatalog } from "./catalogStore.pg";
import type { CatalogStore } from "@/types";

// Resilient catalog proxy: if DATABASE_URL host is unreachable, gracefully falls back to memoryCatalog
export const catalogStore: CatalogStore = {
  async games() {
    if (isDbActive()) {
      try {
        return await pgCatalog.games();
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryCatalog.games();
  },
  async products() {
    if (isDbActive()) {
      try {
        return await pgCatalog.products();
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryCatalog.products();
  },
  async saveGame(g) {
    if (isDbActive()) {
      try {
        return await pgCatalog.saveGame(g);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryCatalog.saveGame(g);
  },
  async saveProduct(p) {
    if (isDbActive()) {
      try {
        return await pgCatalog.saveProduct(p);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryCatalog.saveProduct(p);
  },
};

