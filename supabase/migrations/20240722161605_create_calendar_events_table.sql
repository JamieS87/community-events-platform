create table calendar_events (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users (id) on delete cascade,
  event_id bigint not null,
  calendar_event_id text not null,
  unique (user_id, event_id)
);

alter table calendar_events
  enable row level security;

revoke all
on table calendar_events
from anon, authenticated, public;

grant select
on table calendar_events
to authenticated;

create policy "Authenticated users can view the events they've added to a calendar"
on public.calendar_events
for select
to authenticated
using ( user_id = auth.uid() );