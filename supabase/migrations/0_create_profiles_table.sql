create table profiles (
  user_id uuid not null primary key references auth.users (id) on delete cascade,
  is_staff boolean default false
);

alter table profiles
  enable row level security;

grant all 
on table profiles
to supabase_auth_admin;

revoke all
on table profiles
from anon, authenticated, public;

create policy "only auth admin can access profiles"
on public.profiles
for all
to supabase_auth_admin
using ( true );