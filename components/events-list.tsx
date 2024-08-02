import { Tables } from "@/dbtypes";
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
}: EventsListHeaderProps) => {
  const classNames = {
    loading: "max-w-[200px] animate-pulse h-6 bg-gray-100",
    notLoading: "text-xl font-semibold",
  };

  return (
    <h2 className={loading ? classNames.loading : classNames.notLoading}>
      {children}
    </h2>
  );
};

type EventsListItemsProps = {
  render: ({
    event,
  }: {
    event: Pick<
      Tables<"events">,
      "id" | "name" | "thumbnail" | "pricing_model"
    >;
  }) => ReactNode;
  getter: () => Promise<
    Pick<Tables<"events">, "id" | "name" | "thumbnail" | "pricing_model">[]
  >;
  [k: string]: any;
};

export const EventsListItems = async ({
  render,
  getter,
  ...props
}: EventsListItemsProps) => {
  const events = await getter();
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
  render: () => ReactNode;
  [k: string]: any;
};

export const LoadingEventsListItems = async ({
  count,
  render,
  ...props
}: LoadingEventsListItemsProps) => {
  const loadingEvents = [];
  for (let i = 0; i < count; i++) {
    loadingEvents.push(render());
  }
  return <ul {...props}>{loadingEvents}</ul>;
};
