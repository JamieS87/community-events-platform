"use server";

import { createClient } from "@/utils/supabase/server";
import { auth, calendar } from "@googleapis/calendar";
import { requestCalendarEventsScope } from "./auth";

export async function addEventToCalendar(prev: null | {}, formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw error;
  }

  if (
    !user.app_metadata.google_access_token ||
    !user.app_metadata.google_refresh_token
  ) {
    throw Error("Not authenticated with google");
  }

  const {
    google_access_token: access_token,
    google_refresh_token: refresh_token,
  } = user.app_metadata;

  const authClient = new auth.OAuth2({
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  });
  authClient.setCredentials({
    access_token,
    refresh_token,
  });

  const { scopes, sub } = await authClient.getTokenInfo(access_token);

  if (
    !scopes.find(
      (scope) => scope === "https://www.googleapis.com/auth/calendar.events"
    )
  ) {
    return await requestCalendarEventsScope();
  }

  const calendarApi = calendar({ version: "v3", auth: authClient });
  try {
    const r = await calendarApi.events.list({ calendarId: "primary" });
  } catch (error) {
    console.log(error);
  }
  return null;
}
