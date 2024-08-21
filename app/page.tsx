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
    <div className="w-full flex flex-col">
      <IndexHeader />
      <div className="w-full flex flex-col">
        {/* Latest events */}
        <section id="latest-events" className="w-full pt-8 pb-8">
          <div className="mx-auto max-w-screen-2xl px-2">
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-8" loading={true} />
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
              <EventsListHeader className="mb-8">
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
          </div>
        </section>
        {/* Latest paid events */}
        <section className="w-full pb-8">
          <div className="mx-auto max-w-screen-2xl px-2">
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-8" loading={true} />
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
              <EventsListHeader className="mb-8">Paid events</EventsListHeader>
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
          </div>
        </section>
        {/* Latest PAYF Events */}
        <section className="w-full pb-8">
          <div className="mx-auto max-w-screen-2xl px-2">
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-8" loading={true} />
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
              <EventsListHeader className="mb-8">
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
          </div>
        </section>
        {/* Latest free events */}
        <section className="w-full pb-8">
          <div className="mx-auto max-w-screen-2xl px-2">
            <Suspense
              fallback={
                <>
                  <EventsListHeader className="mb-8" loading={true} />
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
              <EventsListHeader className="mb-8">Free events</EventsListHeader>
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
          </div>
        </section>
      </div>
    </div>
  );
}
