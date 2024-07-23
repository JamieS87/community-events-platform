import { auth } from "@googleapis/calendar";
import { cookies } from "next/headers";

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
      cookies().set("g_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        sameSite: true,
      });
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
