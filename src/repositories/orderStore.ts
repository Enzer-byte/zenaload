import { sql, isDbActive, markDbFailed } from "@/lib/db";
import { memoryOrderStore } from "./orderStore.memory";
import { pgOrderStore } from "./orderStore.pg";
import type { OrderStore } from "@/types";

export const orderStore: OrderStore = {
  async get(id) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.get(id);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.get(id);
  },
  async getByPaymentRef(ref) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.getByPaymentRef(ref);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.getByPaymentRef(ref);
  },
  async getBySupplierTxId(txId) {
    if (isDbActive() && pgOrderStore.getBySupplierTxId) {
      try {
        return await pgOrderStore.getBySupplierTxId(txId);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.getBySupplierTxId ? memoryOrderStore.getBySupplierTxId(txId) : null;
  },
  async create(order) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.create(order);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.create(order);
  },
  async list(limit) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.list(limit);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.list(limit);
  },
  async save(order) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.save(order);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.save(order);
  },
  async claimPaid(paymentRef, eventLabel) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.claimPaid(paymentRef, eventLabel);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.claimPaid(paymentRef, eventLabel);
  },
  async withLock(id, fn) {
    if (isDbActive()) {
      try {
        return await pgOrderStore.withLock(id, fn);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memoryOrderStore.withLock(id, fn);
  },
};

