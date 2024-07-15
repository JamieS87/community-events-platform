create or replace function public.create_user_profile()
returns trigger
language plpgsql
as
$$
begin
  insert into public.profiles (user_id, is_staff)
    values (new.id, false);
  return new;
end;
$$;

create or replace trigger on_insert_create_user_profile
after insert on auth.users
for each row
execute function public.create_user_profile();

grant execute
  on function public.create_user_profile
  to supabase_auth_admin;

revoke execute
  on function public.create_user_profile
  from authenticated, anon, public;
