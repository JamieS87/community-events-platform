import { createClient } from "@/utils/supabase/server";
import { CreateEventForm } from "@/components/forms/create-event-form";
import { format } from "date-fns";
import Link from "next/link";
import AdminEventMenu from "@/components/admin-event-menu";
import PublishEventButton from "@/components/publish-event-button";
import UnpublishEventButton from "@/components/unpublish-event-button";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) {
    throw error;
  }

  return (
    <div className="flex flex-col space-y-4 w-full p-2 max-w-7xl">
      <div className="flex w-full items-center justify-between">
        <h2>Events</h2>
        <CreateEventForm />
      </div>
      <ul className="w-full grid-cols-5 divide-y space-y-2 text-sm">
        <li className="items-center pt-2 text-center grid grid-cols-8 font-semibold">
          <span>Name</span>
          <span>Pricing Model</span>
          <span>Price</span>
          <span>Published</span>
          <span>--</span>
          <span>Start Date</span>
          <span>End Date</span>
        </li>
        {events.map((event) => {
          return (
            <li
              key={event.id}
              className="items-center pt-2 text-center grid grid-cols-8"
            >
              <Link href={`/events/${event.id}`}>
                <h3 className="flex-1">{event.name}</h3>
              </Link>
              <p className="flex-1">{event.pricing_model}</p>
              <p className="flex-1">
                {event.pricing_model === "payf"
                  ? "N/A"
                  : `£${event.price / 100}`}
              </p>
              <p className="flex-1">{String(event.published)}</p>
              <p className="flex-1">
                {event.published ? (
                  <UnpublishEventButton eventId={event.id} />
                ) : (
                  <PublishEventButton eventId={event.id} />
                )}
              </p>
              <p className="flex-1">{format(event.start_date, "PPP")}</p>
              <p className="flex-1">{format(event.end_date, "PPP")}</p>
              <div>
                <AdminEventMenu eventId={event.id} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
