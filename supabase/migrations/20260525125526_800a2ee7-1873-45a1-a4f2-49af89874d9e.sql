
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy "Anyone can subscribe" on public.email_subscribers;
create policy "Anyone can subscribe"
on public.email_subscribers for insert
with check (
  email is not null
  and length(email) between 5 and 320
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);
