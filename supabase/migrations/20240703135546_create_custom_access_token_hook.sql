
-- code copied and modified from https://supabase.com/docs/guides/auth/auth-hooks#hook-custom-access-token
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    claims jsonb;
    is_staff boolean;
  begin
    -- Check if the user is marked as staff in the profiles table
    select public.profiles.is_staff into is_staff from public.profiles where user_id = (event->>'user_id')::uuid;

    -- Proceed only if the user is staff
    if is_staff then
      claims := event->'claims';

      -- Check if 'app_metadata' exists in claims
      if jsonb_typeof(claims->'app_metadata') is null then
        -- If 'app_metadata' does not exist, create an empty object
        claims := jsonb_set(claims, '{app_metadata}', '{}');
      end if;

      -- Set a claim of 'staff'
      claims := jsonb_set(claims, '{app_metadata, staff}', 'true');

      -- Update the 'claims' object in the original event
      event := jsonb_set(event, '{claims}', claims);
    end if;

    -- Return the modified or original event
    return event;
  end;
$$;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

grant all
  on table public.profiles
  to supabase_auth_admin;

revoke all
  on table public.profiles
  from authenticated, anon, public;