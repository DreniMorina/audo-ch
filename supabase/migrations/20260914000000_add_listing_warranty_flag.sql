-- Store whether a vehicle is sold with a warranty so buyers can filter explicitly.
alter table public.listings
  add column if not exists has_warranty boolean not null default false;

-- Preserve the meaning of existing warranty duration data.
update public.listings
set has_warranty = true
where warranty_months > 0;

