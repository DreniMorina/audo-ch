begin;

create extension if not exists pgtap with schema extensions;
select plan(9);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password)
values (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'slots@example.test',
  ''
);

insert into public.listings (
  id, brand, model, year, price, mileage, battery_kwh, range_km,
  charging_kw, location, seller_name, seller_email, status, seller_user_id
) values (
  '22222222-2222-2222-2222-222222222222', 'Test', 'Slots', 2026,
  50000, 0, 80, 500, 200, 'Zürich', 'Slot Tester',
  'slots@example.test', 'approved', '11111111-1111-1111-1111-111111111111'
);

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

select ok(
  public.is_listing_asset_slot(
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/image-4',
    'listing-images'
  ),
  'the final image slot is valid'
);

select ok(
  not public.is_listing_asset_slot(
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/image-5',
    'listing-images'
  ),
  'a fifth image is rejected'
);

select ok(
  public.is_listing_asset_slot(
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/battery-certificate',
    'listing-documents'
  ),
  'the certificate slot is valid'
);

select ok(
  not public.is_listing_asset_slot(
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/battery-certificate-2',
    'listing-documents'
  ),
  'a second certificate is rejected'
);

select ok(
  not public.is_listing_asset_slot(
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/nested/image-1',
    'listing-images'
  ),
  'nested paths cannot bypass the direct Storage API policy'
);

insert into storage.objects (bucket_id, name, owner)
values (
  'listing-images',
  '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/image-4',
  '11111111-1111-1111-1111-111111111111'
);
select pass('a direct Storage insert can claim the final valid slot');

select throws_ok(
  $$insert into storage.objects (bucket_id, name, owner) values (
    'listing-images',
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/image-4',
    '11111111-1111-1111-1111-111111111111'
  )$$,
  '23505',
  'concurrent claims of the same final slot are serialized by uniqueness'
);

delete from storage.objects
where bucket_id = 'listing-images'
  and name = '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/image-4';
insert into storage.objects (bucket_id, name, owner)
values (
  'listing-images',
  '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/image-4',
  '11111111-1111-1111-1111-111111111111'
);
select pass('deleting an object releases its slot for reuse');

select throws_ok(
  $$insert into storage.objects (bucket_id, name, owner) values (
    'listing-documents',
    '11111111-1111-1111-1111-111111111111/22222222-2222-2222-2222-222222222222/other.pdf',
    '11111111-1111-1111-1111-111111111111'
  )$$,
  '42501',
  'direct Storage calls cannot bypass the certificate slot'
);

select * from finish();
rollback;
