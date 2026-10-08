import { sql, isDbActive, markDbFailed } from "@/lib/db";
import type { Notice, OpsStore, Ticket } from "@/types";

const G = globalThis as unknown as { __ops?: { t: Ticket[]; n: Notice[] } };
const m = (G.__ops ??= { t: [], n: [] });

/* eslint-disable @typescript-eslint/no-explicit-any */
const memory: OpsStore = {
  addTicket: async (t) => void m.t.unshift(t),
  tickets: async () => [...m.t],
  setTicketOpen: async (id, open) => void (m.t.find((x) => x.id === id)!.open = open),
  addNotice: async (n) => void m.n.unshift(n),
  notices: async () => [...m.n],
  readAll: async () => void m.n.forEach((n) => (n.read = true)),
};

const pg = (): OpsStore => ({
  addTicket: async (t) => void (await sql!`insert into support_tickets (id, order_reference, email, subject, message, open, created_at) values (${t.id}, ${t.orderId ?? null}, ${t.email}, ${t.subject}, ${t.message}, ${t.open}, ${t.createdAt})`),
  tickets: async () => (await sql!`select * from support_tickets order by created_at desc limit 200`).map((r: any) => ({ id: r.id, orderId: r.order_reference ?? undefined, email: r.email, subject: r.subject, message: r.message, open: r.open, createdAt: new Date(r.created_at).toISOString() })),
  setTicketOpen: async (id, open) => void (await sql!`update support_tickets set open = ${open} where id = ${id}`),
  addNotice: async (n) => void (await sql!`insert into notifications (id, level, title, detail, order_reference, read, created_at) values (${n.id}, ${n.level}, ${n.title}, ${n.detail}, ${n.orderId ?? null}, ${n.read}, ${n.createdAt})`),
  notices: async () => (await sql!`select * from notifications order by created_at desc limit 200`).map((r: any) => ({ id: r.id, level: r.level, title: r.title, detail: r.detail, orderId: r.order_reference ?? undefined, read: r.read, createdAt: new Date(r.created_at).toISOString() })),
  readAll: async () => void (await sql!`update notifications set read = true where read = false`),
});

export const opsStore: OpsStore = {
  async addTicket(t) {
    if (isDbActive()) {
      try {
        return await pg().addTicket(t);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memory.addTicket(t);
  },
  async tickets() {
    if (isDbActive()) {
      try {
        return await pg().tickets();
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memory.tickets();
  },
  async setTicketOpen(id, open) {
    if (isDbActive()) {
      try {
        return await pg().setTicketOpen(id, open);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memory.setTicketOpen(id, open);
  },
  async addNotice(n) {
    if (isDbActive()) {
      try {
        return await pg().addNotice(n);
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memory.addNotice(n);
  },
  async notices() {
    if (isDbActive()) {
      try {
        return await pg().notices();
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memory.notices();
  },
  async readAll() {
    if (isDbActive()) {
      try {
        return await pg().readAll();
      } catch (e) {
        markDbFailed(e);
      }
    }
    return memory.readAll();
  },
};

