"use server";

import { createClient } from "@/utils/supabase/server";
import { calendar } from "@googleapis/calendar";
import { redirect } from "next/navigation";
import { createGoogleServerClient } from "@/utils/google/server";
import { Tables } from "@/dbtypes";
import { insertGoogleCalendarEvent } from "@/utils/google/calendar";
import { getUserGoogleTokens } from "@/utils/supabase/admin";

export async function addEventToCalendar(
  eventId: Tables<"events">["id"],
  prev: null | {},
  formData: FormData
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return redirect("/login");
  }

  const { user } = data;

  const { access_token, refresh_token } = await getUserGoogleTokens(user);

  console.log("Access token: ", access_token, "Refresh token: ", refresh_token);

  const googleClient = await createGoogleServerClient();
  googleClient.setCredentials({ access_token, refresh_token });

  if (!access_token || !refresh_token) {
    return { code: "google_identity_required" };
  }

  const { data: event, error: getEventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (getEventError) {
    throw getEventError;
  }

  try {
    const { scopes } = await googleClient.getTokenInfo(access_token);
    console.log(scopes);
    if (
      !scopes.find(
        (scope) => scope === "https://www.googleapis.com/auth/calendar.events"
      )
    ) {
      console.log("Required scope not found");
      console.log(scopes);
      //User hasn't granted the required scopes
      return { code: "scopes_required" };
    }
  } catch (err) {
    console.log(err);
    throw err;
  }

  const calendarApi = calendar({ version: "v3", auth: googleClient });
  try {
    await insertGoogleCalendarEvent(calendarApi, event);
    return { code: "success" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
