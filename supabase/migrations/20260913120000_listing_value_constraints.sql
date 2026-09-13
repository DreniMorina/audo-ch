-- Reject impossible numeric listing values in the database.
--
-- Seller listings publish immediately as `approved`, so a negative price or
-- mileage becomes public right away and produces nonsensical cards and filter
-- results. The form inputs carry matching min/max attributes, but the client is
-- not the place this is decided.
--
-- Before applying to an existing project, check that no stored row violates the
-- rules below -- the migration aborts (and rolls back) if one does:
--
--   select id, price, mileage, range_km, charging_kw, battery_kwh, year,
--          battery_health, warranty_months
--   from public.listings
--   where price < 0 or mileage < 0 or range_km < 0 or charging_kw < 0
--      or battery_kwh < 0 or year not between 1990 and 2100
--      or battery_health not between 0 and 100 or warranty_months < 0;

alter table public.listings
  drop constraint if exists listings_non_negative_values,
  drop constraint if exists listings_year_range,
  drop constraint if exists listings_battery_health_percentage,
  drop constraint if exists listings_warranty_months_non_negative;

alter table public.listings
  add constraint listings_non_negative_values check (
    price >= 0
    and mileage >= 0
    and range_km >= 0
    and charging_kw >= 0
    and battery_kwh >= 0
  );

-- Wide enough to need no maintenance, narrow enough to reject overflow garbage.
alter table public.listings
  add constraint listings_year_range check (year between 1990 and 2100);

-- State of health is a percentage of the original capacity.
alter table public.listings
  add constraint listings_battery_health_percentage check (
    battery_health is null or battery_health between 0 and 100
  );

alter table public.listings
  add constraint listings_warranty_months_non_negative check (
    warranty_months is null or warranty_months >= 0
  );
