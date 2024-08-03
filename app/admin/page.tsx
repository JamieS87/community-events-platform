import { createClient } from "@/utils/supabase/server";
import { CreateEventForm } from "@/components/forms/create-event-form";
import { AdminEventList } from "@/components/admin-event-list";

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
      <AdminEventList initialEvents={events} />
    </div>
  );
}
