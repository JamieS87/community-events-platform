import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { PlusIcon } from "lucide-react";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: events, error } = await supabase.from("events").select("*");
  if (error) {
    throw error;
  }

  return (
    <div className="flex flex-col space-y-4 w-full p-2">
      <div className="flex w-full items-center justify-between">
        <h2>Events</h2>
        <Button>
          <PlusIcon className="w-6 h-6" />
          Add Event
        </Button>
      </div>
      <ul className="w-full">
        {events.map((event) => {
          return (
            <li key={event.id} className="flex items-center">
              <h3 className="flex-1">{event.name}</h3>
              <p className="flex-1">{event.description}</p>
              <p className="flex-1">{String(event.published)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
