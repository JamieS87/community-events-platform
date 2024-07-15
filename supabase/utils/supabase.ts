import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env" });

export const createSupabaseClient = async () => {
  const client = createClient(
    process.env.SUPABASE_API_URL!!,
    process.env.SUPABASE_ANON_KEY!!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
  return client;
};

export const createSupabaseServiceClient = () => {
  const client = createClient(
    process.env.SUPABASE_API_URL!!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
  return client;
};
