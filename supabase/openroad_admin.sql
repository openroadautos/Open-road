-- OpenRoad Auto Group inventory admin schema.
-- Run this in Supabase SQL editor, then create an admin user in Supabase Auth.

create extension if not exists "pgcrypto";

create table if not exists openroad_vehicles (
  id uuid primary key default gen_random_uuid(),
  stock_number text not null unique,
  year int not null check (year between 1900 and 2100),
  make text not null,
  model text not null,
  trim text,
  body_type text not null default 'suv',
  mileage int not null default 0 check (mileage >= 0),
  price numeric(10,2) not null default 0 check (price >= 0),
  transmission text not null default 'Automatic',
  fuel_type text not null default 'Gasoline',
  description text not null default '',
  status text not null default 'available' check (status in ('available', 'pending', 'sold')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists openroad_vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references openroad_vehicles(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists openroad_vehicles_status_idx on openroad_vehicles(status);
create index if not exists openroad_vehicles_created_at_idx on openroad_vehicles(created_at desc);
create index if not exists openroad_vehicle_images_vehicle_idx on openroad_vehicle_images(vehicle_id, sort_order);

create or replace function openroad_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end$$;

drop trigger if exists openroad_vehicles_set_updated_at on openroad_vehicles;
create trigger openroad_vehicles_set_updated_at
  before update on openroad_vehicles
  for each row execute function openroad_set_updated_at();

alter table openroad_vehicles enable row level security;
alter table openroad_vehicle_images enable row level security;

drop policy if exists "openroad vehicles public read" on openroad_vehicles;
drop policy if exists "openroad vehicles admin write" on openroad_vehicles;
drop policy if exists "openroad images public read" on openroad_vehicle_images;
drop policy if exists "openroad images admin write" on openroad_vehicle_images;

create policy "openroad vehicles public read"
  on openroad_vehicles for select
  to anon, authenticated
  using (true);

create policy "openroad vehicles admin write"
  on openroad_vehicles for all
  to authenticated
  using (true)
  with check (true);

create policy "openroad images public read"
  on openroad_vehicle_images for select
  to anon, authenticated
  using (true);

create policy "openroad images admin write"
  on openroad_vehicle_images for all
  to authenticated
  using (true)
  with check (true);
