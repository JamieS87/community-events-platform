import PurchaseEventButton from "@/components/purchase-event-button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { CalendarClock } from "lucide-react";
import { notFound } from "next/navigation";

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

  if (error) {
    if (error.code === "PGRST116") return notFound();
    throw error;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl w-full p-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">{event.name}</h2>
        {event.pricing_model === "free" && (
          <span className="font-semibold text-sm text-white px-4 py-2 bg-slate-700 rounded-full">
            Free
          </span>
        )}
      </div>
      {event.thumbnail && (
        <Image
          src={`http://127.0.0.1:54321/storage/v1/object/public/${event.thumbnail}`}
          alt="event image preview"
          className="w-full aspect-video object-cover"
          width={1024}
          height={1024}
        />
      )}
      <h3 className="font-semibold text-sm">About</h3>
      <p className="text-sm">{event.description}</p>
      <div className="flex items-center">
        <CalendarClock className="mr-2" />
        <h3 className="font-semibold text-sm">Date and time</h3>
      </div>
      <div className="space-y-2">
        <p className="text-sm">
          Starts{" "}
          <time dateTime={`${event.start_date}T${event.start_time}`}>
            {new Date(event.start_date).toDateString()} - {event.start_time}
          </time>
        </p>
        <p className="text-sm">
          Ends{" "}
          <time dateTime={`${event.end_date}T${event.end_time}`}>
            {new Date(event.end_date).toDateString()} - {event.end_time}
          </time>
        </p>
      </div>
      <p>Price: {`£${event.price / 100}`}</p>
      <PurchaseEventButton user={user} event={event} />
    </div>
  );
}
