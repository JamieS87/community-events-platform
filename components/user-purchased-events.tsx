"use server";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import AddToCalendarButton from "./add-to-calendar-button";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function UserPurchasedEvents() {
  const supabase = createClient();
  const { error } = await supabase.auth.getUser();

  if (error) {
    return redirect("/login");
  }

  const [
    { data: purchasedEvents, error: purchasedEventsError },
    { data: calendarEvents, error: calendarEventsError },
  ] = await Promise.all([
    supabase
      .from("purchased_events")
      .select("id,event_id,name,amount_total,purchased_at")
      .order("purchased_at", { ascending: false })
      .order("id", { ascending: false }),
    supabase.from("calendar_events").select("*"),
  ]);

  if (purchasedEventsError) {
    throw purchasedEventsError;
  }

  if (calendarEventsError) {
    throw calendarEventsError;
  }

  const hasPurchasedEvents =
    purchasedEvents !== null && purchasedEvents.length > 0;

  return (
    <div data-testid="purchased-events">
      {!hasPurchasedEvents ? (
        <div className="text-center text-md text-muted-foreground">
          <span className="block">No purchased events to display yet.</span>
          <span>
            Note: Recently purchased events may not appear here immediately.
          </span>
        </div>
      ) : (
        <ul>
          {purchasedEvents.map(
            ({ id, event_id, name, amount_total, purchased_at }) => {
              return (
                <li
                  key={id}
                  className="border-t py-4 grid grid-cols-4 items-center"
                >
                  <Link href={`/events/${event_id}`}>{name}</Link>
                  <p>{amount_total !== null ? amount_total / 100 : "N/A"}</p>
                  <p>{purchased_at && format(purchased_at, "PPP")}</p>
                  <div className="col-start-4 ml-auto">
                    <AddToCalendarButton
                      event_id={event_id}
                      isInCalendar={
                        calendarEvents?.find(
                          (calendarEvent) => calendarEvent.event_id === event_id
                        ) !== undefined
                      }
                    />
                  </div>
                </li>
              );
            }
          )}
        </ul>
      )}
    </div>
  );
}
