import EventCard, { LoadingEventCard } from "@/components/event-card";
import {
  EventsListHeader,
  EventsListItems,
  LoadingEventsListItems,
} from "@/components/events-list";
import IndexHeader from "@/components/index-header";

import {
  getLatestEvents,
  getLatestFreeEvents,
  getLatestPaidEvents,
  getLatestPAYFEvents,
} from "@/utils/events/server";
import { Suspense } from "react";

export default async function Index() {
  const perSectionEventCount = 6;

  return (
    <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-20">
      <div className="w-full flex flex-col gap-20 px-2">
        <IndexHeader />
        <div className="w-full flex flex-col gap-6 h-full">
          {/* Latest events */}
          <section id="latest-events">
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-4 text-2xl" loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    count={perSectionEventCount}
                    render={(key) => {
                      return <LoadingEventCard key={key} />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader className="mb-4 text-2xl">
                Latest events
              </EventsListHeader>
              <EventsListItems
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                getter={getLatestEvents.bind(null, perSectionEventCount)}
                render={({ event }) => {
                  return (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  );
                }}
              />
            </Suspense>
          </section>
          {/* Latest paid events */}
          <section>
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-4 text-2xl" loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    count={perSectionEventCount}
                    render={(key) => {
                      return <LoadingEventCard key={key} />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader className="mb-4 text-2xl">
                Paid events
              </EventsListHeader>
              <EventsListItems
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                getter={getLatestPaidEvents.bind(null, perSectionEventCount)}
                render={({ event }) => {
                  return (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  );
                }}
              />
            </Suspense>
          </section>
          {/* Latest PAYF Events */}
          <section>
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-4 text-2xl" loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    count={perSectionEventCount}
                    render={(key) => {
                      return <LoadingEventCard key={key} />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader className="mb-4 text-2xl">
                Pay as you feel events
              </EventsListHeader>
              <EventsListItems
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                getter={getLatestPAYFEvents.bind(null, perSectionEventCount)}
                render={({ event }) => {
                  return (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  );
                }}
              />
            </Suspense>
          </section>
          {/* Latest free events */}
          <section>
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-4 text-2xl" loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    count={perSectionEventCount}
                    render={(key) => {
                      return <LoadingEventCard key={key} />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader className="mb-4 text-2xl">
                Free events
              </EventsListHeader>
              <EventsListItems
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                getter={getLatestFreeEvents.bind(null, perSectionEventCount)}
                render={({ event }) => {
                  return (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  );
                }}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
}
