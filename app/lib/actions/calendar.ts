"use server";
import { GaxiosError } from "gaxios";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/dbtypes";
import { createCalendarClient } from "@/utils/google/calendar";
import { insertSupabaseCalendarEvent } from "@/utils/supabase/admin";
import { cookies } from "next/headers";

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

  const access_token = cookies().get("g_access_token")?.value!!;
  const refresh_token = cookies().get("g_refresh_token")?.value!!;

  if (!access_token || !refresh_token) {
    return { code: "google_identity_required" };
  }

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
        case "invalid_grant":
          return { code: "scopes_required" };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}

// export async function syncCalendar() {
//   const supabase = createClient();

//   const { data, error } = await supabase.auth.getUser();
//   if (error) {
//     throw error;
//   }

//   const access_token = cookies().get("g_access_token")?.value!!;
//   const refresh_token = cookies().get("g_refresh_token")?.value!!;

//   if (!access_token || !refresh_token) {
//     return { code: "google_identity_required" };
//   }

//   const calendar = await createCalendarClient(access_token, refresh_token);

//   try {
//     const [gApiResult, { data: supabaseCalendarEvents, error }] =
//       await Promise.all([
//         calendar.events.list({ calendarId: "primary" }),
//         supabase.from("calendar_events").select("*"),
//       ]);

//     if (error || gApiResult.status !== 200) {
//       throw (
//         error ||
//         Error(`Google Calendar api returned status: ${gApiResult.status}`)
//       );
//     }

//     if (gApiResult.data.items === undefined) {
//       throw Error(
//         "Google Calendar API response doesn't contain the expected response"
//       );
//     }

//     const googleCalendarEvents = gApiResult.data.items;

//     const deletedGoogleEvents = supabaseCalendarEvents.filter((calEvent) => {
//       return (
//         googleCalendarEvents.find(
//           (gCalEvent) => gCalEvent.id !== calEvent.calendar_event_id
//         ) === undefined
//       );
//     });
//   } catch (error) {
//     if (error instanceof GaxiosError) {
//       if (error.message === "invalid_grant") {
//         return { code: "scopes_required" };
//       }
//     }
//   }
// }
