create table customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  customer_id text not null
);

revoke all
on table customers
from anon, authenticated, public;

alter table customers
  enable row level security;