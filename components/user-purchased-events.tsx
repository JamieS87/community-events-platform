"use server";

import { Tables } from "@/dbtypes";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function UserPurchasedEvents() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user || userError) {
    throw "Encountered an error retrieving user";
  }

  const { data: purchasedEvents, error: purchasedEventsError } = await supabase
    .from("purchased_events")
    .select("id,event_id,event:events(id,name)")
    .eq("user_id", user.id);

  if (purchasedEventsError) {
    throw purchasedEventsError;
  }

  return (
    <div data-testid="purchased-events">
      {purchasedEvents.length === 0 ? (
        "No purchased events to display"
      ) : (
        <ul>
          {purchasedEvents.map(({ id, event_id, event }) => {
            return (
              <li key={id}>
                <Link href={`/events/${event_id}`}>
                  {(event as Tables<"events">).name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
