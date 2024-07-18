import PurchaseEventButton from "@/components/purchase-event-button";
import { createClient } from "@/utils/supabase/server";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl w-full p-2">
      <h2 className="font-semibold text-2xl">{event.name}</h2>
      <p>{event.description}</p>
      <p>
        Starts:{" "}
        <time dateTime={`${event.start_date}T${event.start_time}`}>
          {new Date(event.start_date).toDateString()} @ {event.start_time}
        </time>
      </p>
      <p>
        Ends:{" "}
        <time dateTime={`${event.end_date}T${event.end_time}`}>
          {new Date(event.end_date).toDateString()} @ {event.end_time}
        </time>
      </p>
      <p>Price: {`£${event.price / 100}`}</p>
      <PurchaseEventButton user={user} event={event} />
    </div>
  );
}
