create type pricing_model as enum ('free', 'paid', 'payf');

create table events (
  id bigint primary key generated always as identity,
  name varchar(256) default 'Untitled Event' constraint name_min_length check (LENGTH(name) >= 8),
  description varchar(256) not null default 'No description' constraint description_min_length check (LENGTH(description) >= 10),
  start_date date not null default current_date,
  end_date date not null default current_date,
  start_time time not null default '12:00',
  end_time time not null default '20:00',
  published boolean not null default false,
  pricing_model pricing_model not null default 'free',
  price bigint not null default 0 constraint zero_or_positive check (price >= 0),
  created_at timestamp not null default current_timestamp,
  updated_at timestamp default null,
  thumbnail text default null,
  constraint valid_dates_times check (
    ( ((start_date = end_date) and (start_time < end_time)) or ((start_date < end_date) and ((start_date + start_time) < (end_date + end_time))) )
  )
);

alter table events
  enable row level security;

create policy "Unauthenticated and Authenticated users can only see published events"
on events 
for select
to anon, authenticated
using ( ( published = true ));

create policy "Staff can see all events"
on events
for select
to authenticated
using ( (auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true) );

create policy "Staff can create events"
on events
for insert
to authenticated
with check ( (auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true) );

create policy "Staff can update events"
on events
for update
to authenticated
using ( (auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true) );

create policy "Staff can delete events"
on events
for delete
to authenticated
using ( (auth.jwt() -> 'app_metadata' -> 'staff') = to_jsonb(true) );

create or replace function public.set_event_updated_at()
returns trigger
language plpgsql
as
$$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$;

create or replace trigger update_event
before update on public.events
for each row
execute function public.set_event_updated_at();