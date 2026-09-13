-- Allow authenticated users to upload listing images into their own folder.
-- Supabase Storage sets the owner while inserting the object row, so checking
-- owner inside the insert WITH CHECK policy can reject otherwise valid uploads.

drop policy if exists "Users can upload own listing images" on storage.objects;

create policy "Users can upload own listing images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
