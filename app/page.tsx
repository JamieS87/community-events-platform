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
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-20">
      <div className="w-full flex flex-col gap-20 px-2">
        <IndexHeader />
        <main className="w-full flex flex-col gap-6">
          {/* Latest events */}
          <section>
            <Suspense
              fallback={
                <>
                  <EventsListHeader loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-3 gap-4"
                    count={5}
                    render={() => {
                      return <LoadingEventCard />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader>Latest events</EventsListHeader>
              <EventsListItems
                className="grid grid-cols-3 gap-4"
                getter={getLatestEvents.bind(null, 5)}
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
                  <EventsListHeader loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-3 gap-4"
                    count={5}
                    render={() => {
                      return <LoadingEventCard />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader>Paid events</EventsListHeader>
              <EventsListItems
                className="grid grid-cols-3 gap-4"
                getter={getLatestPaidEvents.bind(null, 5)}
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
                  <EventsListHeader loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-3 gap-4"
                    count={5}
                    render={() => {
                      return <LoadingEventCard />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader>Pay as you feel events</EventsListHeader>
              <EventsListItems
                className="grid grid-cols-3 gap-4"
                getter={getLatestPAYFEvents.bind(null, 5)}
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
                  <EventsListHeader loading={true} />
                  <LoadingEventsListItems
                    className="grid grid-cols-3 gap-4"
                    count={5}
                    render={() => {
                      return <LoadingEventCard />;
                    }}
                  />
                </>
              }
            >
              <EventsListHeader>Free events</EventsListHeader>
              <EventsListItems
                className="grid grid-cols-3 gap-4"
                getter={getLatestFreeEvents.bind(null, 5)}
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
        </main>
      </div>
    </div>
  );
}
