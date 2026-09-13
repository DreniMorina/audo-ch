create or replace function public.marketplace_stats()
returns table (vehicle_count bigint, location_count bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select count(*)::bigint, count(distinct location)::bigint
  from public.listings
  where status = 'approved';
$$;

grant execute on function public.marketplace_stats() to anon, authenticated;
