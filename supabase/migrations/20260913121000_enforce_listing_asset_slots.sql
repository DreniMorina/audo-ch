-- Bound listing assets with deterministic object names. The unique constraint
-- on storage.objects(bucket_id, name) makes an INSERT into a slot an atomic
-- claim: two concurrent requests cannot both claim the fourth image slot.
-- Deleting the object releases its slot immediately.

create or replace function public.is_listing_asset_slot(object_name text, asset_bucket text)
returns boolean
language sql
stable
security definer
set search_path = public, storage
as $$
  select
    coalesce(array_length(storage.foldername(object_name), 1), 0) = 2
    and (storage.foldername(object_name))[1] = auth.uid()::text
    and exists (
      select 1
      from public.listings l
      where l.id::text = (storage.foldername(object_name))[2]
        and l.seller_user_id = auth.uid()
    )
    and case asset_bucket
      when 'listing-images' then storage.filename(object_name) in
        ('image-1', 'image-2', 'image-3', 'image-4')
      when 'listing-documents' then storage.filename(object_name) = 'battery-certificate'
      else false
    end;
$$;

revoke all on function public.is_listing_asset_slot(text, text) from public;
grant execute on function public.is_listing_asset_slot(text, text) to authenticated;

drop policy if exists "Users can upload own listing images" on storage.objects;
create policy "Users can upload own listing images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-images'
  and public.is_listing_asset_slot(name, bucket_id)
);

drop policy if exists "Users can update own listing images and admins can update all" on storage.objects;
create policy "Users can update own listing images and admins can update all"
on storage.objects for update to authenticated
using (bucket_id = 'listing-images' and (owner = auth.uid() or public.is_admin()))
with check (
  bucket_id = 'listing-images'
  and (public.is_listing_asset_slot(name, bucket_id) or public.is_admin())
);

drop policy if exists "Users can upload own listing documents" on storage.objects;
create policy "Users can upload own listing documents"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-documents'
  and public.is_listing_asset_slot(name, bucket_id)
);

drop policy if exists "Users can update own listing documents and admins can update all" on storage.objects;
create policy "Users can update own listing documents and admins can update all"
on storage.objects for update to authenticated
using (bucket_id = 'listing-documents' and (owner = auth.uid() or public.is_admin()))
with check (
  bucket_id = 'listing-documents'
  and (public.is_listing_asset_slot(name, bucket_id) or public.is_admin())
);
