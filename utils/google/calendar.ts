import { Tables } from "@/dbtypes";
import { calendar_v3 } from "@googleapis/calendar";

export async function insertGoogleCalendarEvent(
  calendar: calendar_v3.Calendar,
  event: Tables<"events">
) {
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
  return result;
}
