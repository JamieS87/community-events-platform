import { Tables } from "@/dbtypes";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type EventsListHeaderProps =
  | {
      children: ReactNode;
      loading?: false;
    }
  | { loading: true; children?: ReactNode };

export const EventsListHeader = async ({
  children,
  loading = false,
  ...props
}: EventsListHeaderProps & { [k: string]: any }) => {
  const classNames = {
    loading: cn([
      "max-w-[200px] animate-pulse h-6 bg-gray-100",
      props.className,
    ]),
    notLoading: cn(["text-xl font-semibold", props.className]),
  };

  return (
    <h2 className={loading ? classNames.loading : classNames.notLoading}>
      {children}
    </h2>
  );
};

type Event = Pick<
  Tables<"events">,
  "id" | "name" | "thumbnail" | "pricing_model" | "price" | "start_date"
>;

type EventsListItemsProps = {
  render: ({ event }: { event: Event }) => ReactNode;
  getter: () => Promise<Event[]>;
  [k: string]: any;
};

export const EventsListItems = async ({
  render,
  getter,
  ...props
}: EventsListItemsProps) => {
  const events = await getter();
  if (!events.length) {
    return (
      <p className="w-full text-center shadow-sm border py-8">
        No events to display yet
      </p>
    );
  }
  return (
    <ul {...props}>
      {events.map((event) => {
        return render({ event });
      })}
    </ul>
  );
};

type LoadingEventsListItemsProps = {
  count: number;
  render: (key: number) => ReactNode;
  [k: string]: any;
};

export const LoadingEventsListItems = async ({
  count,
  render,
  ...props
}: LoadingEventsListItemsProps) => {
  const loadingEvents = [];
  for (let i = 0; i < count; i++) {
    loadingEvents.push(render(i));
  }
  return <ul {...props}>{loadingEvents}</ul>;
};
