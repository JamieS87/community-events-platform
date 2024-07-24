import { auth } from "@googleapis/calendar";
import { cookies } from "next/headers";

import { createClient } from "../supabase/server";

export async function createGoogleServerClient(
  access_token: string,
  refresh_token: string
) {
  const client = new auth.OAuth2({
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    credentials: {
      access_token,
      refresh_token,
    },
  });

  client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) {
      await setGoogleRefreshToken(tokens.refresh_token);
    }
    if (tokens.access_token) {
      cookies().set("g_access_token", tokens.access_token, {
        httpOnly: true,
        sameSite: true,
      });
    }
  });
  return client;
}

export const setGoogleRefreshToken = async (refresh_token: string) => {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_google_refresh_token", {
    refresh_token,
  });
  if (error) {
    throw error;
  }
};

export const getGoogleRefreshToken = async () => {
  const supabase = createClient();
  const result = await supabase.rpc("get_google_refresh_token");
  if (result.error) {
    throw result.error;
  }
  return result.data;
};
