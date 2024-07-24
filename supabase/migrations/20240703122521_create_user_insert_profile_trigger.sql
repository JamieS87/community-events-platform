create or replace function public.create_user_profile()
returns trigger
security definer
language plpgsql
as
$$
declare
  secretId uuid;
begin
  select into secretId vault.create_secret('');
  insert into public.profiles (user_id, is_staff, googleRefreshToken)
    values (new.id, false, secretId);
  return new;
end;
$$;

grant execute
  on function public.create_user_profile
  to supabase_auth_admin;

revoke execute
  on function public.create_user_profile
  from authenticated, anon, public;

create or replace function public.set_google_refresh_token(refresh_token text)
returns void
security definer
language plpgsql
as
$$
declare
  secretId uuid;
begin
  select googleRefreshToken into secretId from
    public.profiles
    where user_id = ( auth.uid() );
  update vault.secrets
    set secret = refresh_token
    where vault.secrets.id = secretId;
end;
$$;

grant execute 
  on function public.set_google_refresh_token
  to authenticated;

revoke execute
  on function public.set_google_refresh_token
  from anon, public;

create or replace function public.get_google_refresh_token()
returns text
security definer
language plpgsql
as
$$
declare
  result text;
begin
  select decrypted_secret into result 
    from vault.decrypted_secrets
    join public.profiles on googleRefreshToken = vault.decrypted_secrets.id
    where public.profiles.user_id = ( auth.uid() );
  return result;
end;
$$;

grant execute
  on function public.get_google_refresh_token
  to authenticated;

revoke execute
  on function public.get_google_refresh_token
  from anon, public;

create or replace trigger on_insert_create_user_profile
after insert on auth.users
for each row
execute function public.create_user_profile();