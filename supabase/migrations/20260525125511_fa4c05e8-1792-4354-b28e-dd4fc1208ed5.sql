
create type public.listing_status as enum ('pending', 'approved', 'rejected');
create type public.seller_type as enum ('Private', 'Dealer');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  year integer not null,
  price integer not null,
  mileage integer not null,
  battery_kwh numeric not null,
  range_km integer not null,
  charging_kw integer not null,
  fast_charging boolean not null default true,
  location text not null,
  country text not null default 'DE',
  seller_type public.seller_type not null default 'Private',
  seller_name text not null,
  seller_email text not null,
  seller_phone text,
  battery_health integer,
  warranty_months integer,
  image_url text,
  description text,
  status public.listing_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_created_idx on public.listings (status, created_at desc);

alter table public.listings enable row level security;

-- Anyone can read approved listings
create policy "Approved listings are public"
on public.listings for select
using (status = 'approved');

-- Anyone can submit a listing (will be pending until reviewed)
create policy "Anyone can submit a listing"
on public.listings for insert
with check (status = 'pending');

create table public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

alter table public.email_subscribers enable row level security;

-- Anyone can subscribe; no public read of subscriber list
create policy "Anyone can subscribe"
on public.email_subscribers for insert
with check (true);

-- Auto-update updated_at on listings
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_updated_at
before update on public.listings
for each row execute function public.set_updated_at();
