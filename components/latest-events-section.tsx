import { getLatestEvents } from "@/utils/events/server";
import EventCard, { LoadingEventCard } from "./event-card";

export async function LatestEventsSection({
  headingText,
}: {
  headingText: string;
}) {
  const latestEvents = await getLatestEvents(5);
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{headingText}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestEvents.map((event) => {
          return <EventCard key={event.id} event={event} />;
        })}
      </div>
    </section>
  );
}

export const LoadingLatestEventsSection = async () => {
  return (
    <section>
      <div className="w-[100px] animate-pulse bg-gray-100 h-8 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoadingEventCard />
        <LoadingEventCard />
        <LoadingEventCard />
      </div>
    </section>
  );
};
