-- Tie listing asset uploads to a listing the uploader owns.
--
-- The previous policies only checked the first path segment, so any
-- authenticated account could write an unlimited number of objects to
-- `{own-uid}/anything/...` without a listing behind them. Because both buckets
-- are public and their read policies have no condition, those objects were also
-- publicly readable -- effectively free file hosting on the project's quota.
--
-- The app writes `{userId}/{listingId}/{file}` and always creates the listing row
-- before uploading, so requiring the second segment to name an owned listing
-- matches the real flow. Both INSERT and UPDATE are covered: without the UPDATE
-- check an object could simply be renamed into an unbound path afterwards.
--
-- Scope note: this binds objects to a listing, it does not cap how many assets a
-- listing may have. The four-image limit is still enforced client-side only.

create or replace function public.owns_listing_in_path(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  -- storage.foldername() drops the file name, so [1] is the user id and
  -- [2] the listing id. Comparing as text avoids a cast error on a malformed
  -- segment; the seller_user_id index still narrows the scan first.
  select exists (
    select 1
    from public.listings l
    where l.seller_user_id = auth.uid()
      and l.id::text = (storage.foldername(object_name))[2]
  );
$$;

drop policy if exists "Users can upload own listing images" on storage.objects;
create policy "Users can upload own listing images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.owns_listing_in_path(name)
);

drop policy if exists "Users can update own listing images and admins can update all" on storage.objects;
create policy "Users can update own listing images and admins can update all"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-images' and (owner = auth.uid() or public.is_admin()))
with check (
  bucket_id = 'listing-images'
  and (
    ((storage.foldername(name))[1] = auth.uid()::text and public.owns_listing_in_path(name))
    or public.is_admin()
  )
);

drop policy if exists "Users can upload own listing documents" on storage.objects;
create policy "Users can upload own listing documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.owns_listing_in_path(name)
);

drop policy if exists "Users can update own listing documents and admins can update all" on storage.objects;
create policy "Users can update own listing documents and admins can update all"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-documents' and (owner = auth.uid() or public.is_admin()))
with check (
  bucket_id = 'listing-documents'
  and (
    ((storage.foldername(name))[1] = auth.uid()::text and public.owns_listing_in_path(name))
    or public.is_admin()
  )
);
