"use server";

import { Tables } from "@/dbtypes";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import AddToCalendarButton from "./add-to-calendar-button";
import { redirect } from "next/navigation";

export default async function UserPurchasedEvents() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return redirect("/login");
  }

  const { user } = data;

  const { data: purchasedEvents, error: purchasedEventsError } = await supabase
    .from("purchased_events")
    .select("id,event_id,event:events(id,name)")
    .eq("user_id", user.id);

  const { data: eventsInUserCalendar, error: eventsInUserCalendarError } =
    await supabase.from("calendar_events").select("*");

  if (purchasedEventsError) {
    throw purchasedEventsError;
  }

  const hasPurchasedEvents = purchasedEvents.length > 0;

  return (
    <div data-testid="purchased-events">
      {!hasPurchasedEvents ? (
        <p className="text-center text-lg">
          No purchased events to display yet
        </p>
      ) : (
        <ul>
          {purchasedEvents.map(({ id, event_id, event }) => {
            return (
              <li
                key={id}
                className="border-t py-4 grid grid-cols-4 items-center"
              >
                <Link href={`/events/${event_id}`}>
                  {(event as Tables<"events">).name}
                </Link>
                <div className="col-start-4 ml-auto">
                  <AddToCalendarButton
                    event_id={event_id}
                    isInCalendar={Boolean(
                      eventsInUserCalendar?.find((e) => e.event_id === event_id)
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
