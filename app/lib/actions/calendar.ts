"use server";
import { GaxiosError } from "gaxios";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/dbtypes";
import { createCalendarClient } from "@/utils/google/calendar";
import { insertSupabaseCalendarEvent } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { getGoogleRefreshToken } from "@/utils/google/server";

export async function addEventToCalendar(
  eventId: Tables<"events">["id"],
  prev: null | {},
  formData: FormData
) {
  const supabase = createClient();

  const [
    { data: userData, error: userError },
    { data: event, error: eventError },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("events").select("*").eq("id", eventId).single(),
  ]);

  if (userError || eventError) {
    throw userError || eventError;
  }

  const { user } = userData;

  if (!user.identities?.find((identity) => identity.provider === "google")) {
    return { code: "google_identity_required" };
  }

  const access_token = cookies().get("g_access_token")?.value!!;
  const refresh_token = await getGoogleRefreshToken();

  const calendar = await createCalendarClient(access_token, refresh_token);

  try {
    const result = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: event.name,
        start: {
          timeZone: "UTC",
          dateTime: `${event.start_date}T${event.start_time}`,
        },
        end: {
          timeZone: "UTC",
          dateTime: `${event.end_date}T${event.end_time}`,
        },
      },
    });
    const insertedEvent = result.data;
    if (result.status === 200) {
      await insertSupabaseCalendarEvent(
        user.id,
        event.id,
        <string>insertedEvent.id
      );
      return { code: "success" };
    } else {
      throw Error("Failed to create google calendar event");
    }
  } catch (error) {
    if (error instanceof GaxiosError) {
      switch (error.message) {
        case "Insufficient Permission":
          return { code: "scopes_required" };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}
