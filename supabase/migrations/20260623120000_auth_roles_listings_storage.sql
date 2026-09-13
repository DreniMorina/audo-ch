-- Authenticated offer ownership, hard user/admin roles, immediate publishing, and photo storage.

do $$
begin
  create type public.app_role as enum ('user', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'user'::public.app_role);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin'::public.app_role;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, role)
select id, 'user'::public.app_role from auth.users
on conflict (id) do nothing;

drop policy if exists "Users can read own profile and admins can read all" on public.profiles;
create policy "Users can read own profile and admins can read all"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.listings
  add column if not exists seller_user_id uuid references auth.users(id) on delete set null;

create index if not exists listings_seller_user_id_idx on public.listings (seller_user_id, updated_at desc);

update public.listings
set status = 'approved'
where status = 'pending';

alter table public.listings alter column status set default 'approved';

drop policy if exists "Approved listings are public" on public.listings;
drop policy if exists "Anyone can submit a listing" on public.listings;
drop policy if exists "Users can read own listings and admins can read all" on public.listings;
drop policy if exists "Users can create own approved listings" on public.listings;
drop policy if exists "Users can update own listings and admins can update all" on public.listings;
drop policy if exists "Users can delete own listings and admins can delete all" on public.listings;

create policy "Approved listings are public"
on public.listings for select
to anon, authenticated
using (status = 'approved');

create policy "Users can read own listings and admins can read all"
on public.listings for select
to authenticated
using (seller_user_id = auth.uid() or public.is_admin());

create policy "Users can create own approved listings"
on public.listings for insert
to authenticated
with check (
  seller_user_id = auth.uid()
  and status = 'approved'
);

create policy "Users can update own listings and admins can update all"
on public.listings for update
to authenticated
using (seller_user_id = auth.uid() or public.is_admin())
with check ((seller_user_id = auth.uid() and status = 'approved') or public.is_admin());

create policy "Users can delete own listings and admins can delete all"
on public.listings for delete
to authenticated
using (seller_user_id = auth.uid() or public.is_admin());

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint listing_images_storage_path_owner check (storage_path like seller_user_id::text || '/%')
);

create index if not exists listing_images_listing_order_idx on public.listing_images (listing_id, sort_order, created_at);

alter table public.listing_images enable row level security;

drop policy if exists "Public can read images for approved listings" on public.listing_images;
create policy "Public can read images for approved listings"
on public.listing_images for select
to anon, authenticated
using (exists (select 1 from public.listings l where l.id = listing_id and l.status = 'approved'));

drop policy if exists "Users can manage own images and admins can manage all" on public.listing_images;
create policy "Users can manage own images and admins can manage all"
on public.listing_images for all
to authenticated
using (seller_user_id = auth.uid() or public.is_admin())
with check (
  (seller_user_id = auth.uid() and exists (select 1 from public.listings l where l.id = listing_id and l.seller_user_id = auth.uid()))
  or public.is_admin()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read listing images" on storage.objects;
create policy "Public can read listing images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'listing-images');

drop policy if exists "Users can upload own listing images" on storage.objects;
create policy "Users can upload own listing images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own listing images and admins can update all" on storage.objects;
create policy "Users can update own listing images and admins can update all"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-images' and (owner = auth.uid() or public.is_admin()))
with check (bucket_id = 'listing-images' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

drop policy if exists "Users can delete own listing images and admins can delete all" on storage.objects;
create policy "Users can delete own listing images and admins can delete all"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-images' and (owner = auth.uid() or public.is_admin()));
