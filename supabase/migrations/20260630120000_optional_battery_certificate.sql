-- Optional battery status certificate metadata and PDF storage.

alter table public.listings
  add column if not exists battery_certificate_date text,
  add column if not exists battery_certificate_provider text,
  add column if not exists battery_certificate_pdf_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-documents', 'listing-documents', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read listing documents" on storage.objects;
create policy "Public can read listing documents"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'listing-documents');

drop policy if exists "Users can upload own listing documents" on storage.objects;
create policy "Users can upload own listing documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own listing documents and admins can update all" on storage.objects;
create policy "Users can update own listing documents and admins can update all"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-documents' and (owner = auth.uid() or public.is_admin()))
with check (bucket_id = 'listing-documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

drop policy if exists "Users can delete own listing documents and admins can delete all" on storage.objects;
create policy "Users can delete own listing documents and admins can delete all"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-documents' and (owner = auth.uid() or public.is_admin()));
