import { sql } from "@/lib/db";
import { memoryOrderStore } from "./orderStore.memory";
import { pgOrderStore } from "./orderStore.pg";
export const orderStore = sql ? pgOrderStore : memoryOrderStore;
