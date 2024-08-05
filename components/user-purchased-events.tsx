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
          <li className="hidden md:grid md:grid-cols-4">
            <span className="text-sm font-semibold text-center">Name</span>
            <span className="text-sm font-semibold text-center">
              Amount Total
            </span>
            <span className="text-sm font-semibold text-center">Purchased</span>
            <span className="text-sm font-semibold text-center">--</span>
          </li>
          {purchasedEvents.map(
            ({ id, event_id, name, amount_total, purchased_at }) => {
              return (
                <li
                  key={id}
                  className="border-t py-4 grid grid-cols-4 items-center text-sm text-left md:text-center gap-y-2 md:gap-y-0"
                >
                  <Link
                    className="col-span-4 md:col-span-1"
                    href={`/events/${event_id}`}
                  >
                    {name}
                  </Link>
                  <p className="col-span-4 md:col-span-1">
                    <span className="font-semibold md:hidden">Paid </span>
                    {amount_total !== null ? `£${amount_total / 100}` : "N/A"}
                  </p>
                  <p className="col-span-4 md:col-span-1">
                    <span className="font-semibold md:hidden">Purchased </span>
                    {purchased_at && format(purchased_at, "PPP")}
                  </p>
                  <div className="col-span-4 md:col-span-1 md:col-start-4 md:ml-auto mt-2 md:mt-auto">
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
