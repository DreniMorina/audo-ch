-- Raise optional battery certificate PDF upload limit to 15 MB.

update storage.buckets
set file_size_limit = 15728640
where id = 'listing-documents';
