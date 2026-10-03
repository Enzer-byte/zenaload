create table support_tickets (id text primary key, order_reference text, email text not null, subject text not null, message text not null, open boolean not null default true, created_at timestamptz default now());
create table notifications (id text primary key, level text not null, title text not null, detail text not null, order_reference text, read boolean not null default false, created_at timestamptz default now());
alter table support_tickets enable row level security; alter table notifications enable row level security;
