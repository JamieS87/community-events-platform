"use server";
import { GaxiosError } from "gaxios";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/dbtypes";
import { createCalendarClient } from "@/utils/google/calendar";
import { insertSupabaseCalendarEvent } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { getGoogleRefreshToken } from "@/utils/google/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addEventToCalendar(
  eventId: Tables<"events">["id"],
  prev: null | {},
  formData: FormData
) {
  const supabase = createClient();

  //Get the authenticated user and the purchased event
  const [
    { data: userData, error: userError },
    { data: event, error: eventError },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("purchased_events")
      .select("*")
      .eq("event_id", eventId)
      .limit(1)
      .single(),
  ]);

  if (userError || eventError) {
    throw userError || eventError;
  }

  if (!event) {
    throw Error(
      `Couldn't add purchased event with event_id ${eventId} to calendar because the server returned null`
    );
  }

  if (!userData.user) {
    return redirect("/login");
  }

  const { user } = userData;

  if (!user.identities?.find((identity) => identity.provider === "google")) {
    //User doesn't have a google identity
    return {
      code: "google_identity_required",
      message: "Linked google account required",
    };
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
      revalidatePath("/");
      return { code: "success", message: "Event added to calendar" };
    } else {
      return {
        code: "error",
        message: "An error occured while trying to add event to calendar",
      };
    }
  } catch (error) {
    if (error instanceof GaxiosError) {
      switch (error.message) {
        case "Insufficient Permission":
          return {
            code: "scopes_required",
            message: "Additional scopes required",
          };
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
}
