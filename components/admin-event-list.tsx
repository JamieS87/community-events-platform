"use client";

import { Tables } from "@/dbtypes";
import Link from "next/link";
import { ReactNode, startTransition, useOptimistic, useState } from "react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { EllipsisVertical, Loader2, Trash2 } from "lucide-react";
import {
  deleteEvent,
  publishEvent,
  unpublishEvent,
} from "@/app/lib/actions/events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";

type AdminEventListProps = {
  initialEvents: Tables<"events">[];
};

type OptimisticEvent = {
  publishing: boolean;
  creating: boolean;
  deleting: boolean;
  unpublishing: boolean;
} & Tables<"events">;

export function AdminEventList({ initialEvents }: AdminEventListProps) {
  const { toast } = useToast();
  const [eventToDelete, setEventToDelete] = useState<OptimisticEvent | null>(
    null
  );

  const [optimisticEvents, addOptimisticEvent] = useOptimistic(
    initialEvents.map((event) => ({
      ...event,
      publishing: false,
      unpublishing: false,
      creating: false,
      deleting: false,
    })),
    (currentEvents: OptimisticEvent[], newEvent: OptimisticEvent) => {
      const isNewEvent = !currentEvents.some(
        (event) => event.id === newEvent.id
      );
      if (!isNewEvent) {
        const eventIndex = currentEvents.findIndex(
          (event) => event.id === newEvent.id
        );
        const newEvents = [...currentEvents];
        newEvents.splice(eventIndex, 1, newEvent);
        return newEvents;
      }
      return [...currentEvents, newEvent];
    }
  );

  async function handleConfirmPublishEvent(event: OptimisticEvent) {
    startTransition(() => {
      addOptimisticEvent({ ...event, published: true });
    });
    await publishEvent(event.id);
  }

  async function handleConfirmUnpublishEvent(event: OptimisticEvent) {
    startTransition(() => addOptimisticEvent({ ...event, published: false }));
    await unpublishEvent(event.id);
  }

  async function handleConfirmDeleteEvents() {
    if (!eventToDelete) return;
    const event = eventToDelete;
    setEventToDelete(null);
    startTransition(() => addOptimisticEvent({ ...event, deleting: true }));
    const result = await deleteEvent(event.id);
    if (result.code === "error") {
      toast({
        title: "Delete Event Failed",
        description: result.message,
        variant: "destructive",
      });
    } else if (result.code === "success") {
      toast({
        title: "Event Deleted",
        description: result.message,
      });
    }
  }

  function handleCloseDeleteEvent() {
    setEventToDelete(null);
  }

  return (
    <>
      <DeleteEventDialog
        open={eventToDelete !== null}
        onConfirm={() => handleConfirmDeleteEvents()}
        onClose={() => handleCloseDeleteEvent()}
      />
      <ul data-testid="admin-events-list">
        <li className="grid grid-cols-3 md:grid-cols-7 font-semibold text-center text-sm mt-4">
          <span>Name</span>
          <span className="hidden md:block">Pricing Model</span>
          <span className="hidden md:block">Price</span>
          <span>Published</span>
          <span className="hidden md:block">Start Date</span>
          <span className="hidden md:block">End Date</span>
          <span>Actions</span>
        </li>
        {optimisticEvents.map((event) => {
          return (
            <li
              key={event.id}
              className={
                "items-center pt-4 text-center grid grid-cols-3 md:grid-cols-7 relative text-sm"
              }
            >
              {event.deleting && (
                <div className="w-full h-full absolute flex items-center justify-center font-semibold bg-gray-100 opacity-90">
                  Deleting...
                  <Loader2 className="w-4 h-4 ml-4 animate-spin" />
                </div>
              )}
              <Link href={`/events/${event.id}`}>
                <h3 className="flex-1">{event.name}</h3>
              </Link>
              <p className="hidden md:block">{event.pricing_model}</p>
              <p className="hidden md:block">
                {event.pricing_model === "payf"
                  ? "N/A"
                  : `£${event.price / 100}`}
              </p>
              <span>
                {event.published ? (
                  <UnpublishEventDialog
                    trigger={
                      <Button variant="secondary" disabled={event.unpublishing}>
                        {event.unpublishing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Unpublishing...
                          </>
                        ) : (
                          "Unpublish"
                        )}
                      </Button>
                    }
                    onConfirm={async () => handleConfirmUnpublishEvent(event)}
                  />
                ) : (
                  <PublishEventDialog
                    trigger={
                      <Button disabled={event.publishing}>
                        {event.publishing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Publishing...
                          </>
                        ) : (
                          "Publish"
                        )}
                      </Button>
                    }
                    onConfirm={() => handleConfirmPublishEvent(event)}
                  />
                )}
              </span>
              <p className="hidden md:block">
                {format(event.start_date, "PPP")}
              </p>
              <p className="hidden md:block">{format(event.end_date, "PPP")}</p>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <span className="sr-only">Actions</span>
                      <EllipsisVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="w-full"
                      onClick={() => setEventToDelete(event)}
                    >
                      <div className="flex items-center w-full">
                        <Trash2 className="w-4 h-4" />
                        <span className="mx-auto text-sm font-semibold">
                          Delete
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

type EventActionDialogProps = {
  trigger: ReactNode;
  onConfirm: () => void;
};

const UnpublishEventDialog = ({
  trigger,
  onConfirm,
}: EventActionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unpublish Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Unublishing an event will make it unviewable and unpurchasable by
            the public.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              onConfirm();
            }}
          >
            Unpublish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const PublishEventDialog = ({ trigger, onConfirm }: EventActionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Publishing an event will make it visible to the public.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              onConfirm();
            }}
          >
            Publish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type DeleteEventDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const DeleteEventDialog = ({
  onConfirm,
  open,
  onClose,
}: DeleteEventDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting an event cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              onConfirm();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
