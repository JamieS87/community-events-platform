import { auth } from "@googleapis/calendar";
import { setUserGoogleTokens } from "../supabase/admin";
import { createClient } from "../supabase/server";

export async function createGoogleServerClient() {
  const client = new auth.OAuth2({
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  });

  client.on("tokens", async (tokens) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    const { user } = data;
    if (tokens.refresh_token) {
      await setUserGoogleTokens(
        user,
        user.app_metadata.google_access_token,
        tokens.refresh_token
      );
    }
    if (tokens.access_token) {
      await setUserGoogleTokens(
        user,
        tokens.access_token,
        user.app_metadata.google_refresh_token
      );
    }
  });
  return client;
}
