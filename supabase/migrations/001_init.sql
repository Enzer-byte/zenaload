-- Run with Supabase CLI. Access only via server-side service role; RLS on, no public policies.
create type payment_status as enum ('UNPAID','PAYMENT_PENDING','PAID','PAYMENT_FAILED','REFUNDED');
create type fulfillment_status as enum ('NOT_STARTED','PROCESSING','SUCCESSFUL','FAILED','PENDING_REVIEW');
create table games (id text primary key, slug text unique not null, name text not null, category text not null, description text, player_fields jsonb not null, supplier_id text not null, active boolean default true, featured boolean default false, sort_order int default 0);
create table products (id text primary key, game_id text references games(id), name text not null, denomination int not null, currency text default 'NGN', retail_price numeric(12,2) not null, supplier_cost numeric(12,2) not null, supplier_product_id text not null, active boolean default true, featured boolean default false, popular boolean default false);
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_reference varchar(32) unique not null,
  game_id text references games(id), product_id text references products(id),
  target_player_fields jsonb not null,
  customer_email text not null, customer_phone text not null, customer_whatsapp text,
  retail_price_ngn numeric(12,2) not null, wholesale_cost_ngn numeric(12,2) not null,
  payment_status payment_status not null default 'UNPAID', fulfillment_status fulfillment_status not null default 'NOT_STARTED',
  payment_reference varchar(128) unique,          -- one payment can only ever back one order
  supplier_id text, supplier_reference varchar(128),
  retry_count int not null default 0, error_message text,
  created_at timestamptz default now(), updated_at timestamptz default now());
create table webhook_events (                      -- append-only; the unique key IS the idempotency lock
  id bigserial primary key, provider text not null, event_id text not null, payload jsonb, received_at timestamptz default now(),
  unique (provider, event_id));
create table order_events (id bigserial primary key, order_id uuid references orders(id), label text not null, at timestamptz default now());
alter table orders enable row level security; alter table webhook_events enable row level security;
-- Worker locking: begin; select * from orders where id=$1 for update; ...update...; commit;
