create table purchased_events (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id bigint not null references public.events (id),
  wh_event_id text unique,
  cs_id text unique
);

alter table purchased_events
  enable row level security;

revoke all
on table purchased_events
from anon, authenticated, public;

grant select
on table purchased_events
to authenticated;

create policy "Authenticated users can view their own purchased events"
on public.purchased_events
for select
to authenticated
using ( user_id = auth.uid() );