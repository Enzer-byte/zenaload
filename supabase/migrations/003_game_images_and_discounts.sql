-- Zenaload migration: add image_url to games and original_price to products
alter table games add column if not exists image_url text;
alter table products add column if not exists original_price numeric(12,2);
