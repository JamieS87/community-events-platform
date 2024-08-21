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
    <div className="w-full min-h-screen">
      <div className="px-2 py-4 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <div className="p-4 border border-slate-300 shadow-sm rounded-md bg-white">
          <div className="flex w-full items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">Events</h2>
            <CreateEventForm />
          </div>
          <AdminEventList initialEvents={events} />
        </div>
      </div>
    </div>
  );
}
