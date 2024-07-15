import { createClient } from "@/utils/supabase/server";
import EventCard from "./event-card";

export default async function IndexEventsList() {
  const supabase = createClient();

  //Get events sorted by creation date in descending order.
  //Anon and authenticated users can only see published events,
  //but we select published events explicitly, otherwise staff users
  //would see unpublished events on their homepage.
  const { data: events, error } = await supabase
    .from("events")
    .select("id,name,description")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .order("id");
  if (error) throw error;
  return (
    <ul className="w-full">
      {events.map((event) => {
        return (
          <li key={event.id}>
            <EventCard event={event} />
          </li>
        );
      })}
    </ul>
  );
}
