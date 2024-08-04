import PurchaseEventButton from "@/components/purchase-event-button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { CalendarClock } from "lucide-react";
import { notFound } from "next/navigation";
import { format, parse } from "date-fns";
import PricingModelBadge from "@/components/pricing-model-badge";
import PurchasePAYFEventButton from "@/components/purchase-payf-event-button";
import { isPurchasableEvent } from "@/utils/events/client";

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

  return (
    <div className="flex flex-col gap-y-6 mt-6 max-w-4xl w-full p-2">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">{event.name}</h2>
        <PricingModelBadge
          pricing_model={event.pricing_model}
          variant={"secondary"}
        />
      </div>
      {/* Image */}
      <div className="flex flex-col h-full gap-y-4">
        {event.thumbnail && (
          <Image
            src={`http://127.0.0.1:54321/storage/v1/object/public/${event.thumbnail}`}
            alt="event image preview"
            className="w-full aspect-video object-cover"
            width={1024}
            height={1024}
          />
        )}
      </div>
      {/* About */}
      <div className="flex flex-col gap-y-6">
        <h3 className="font-semibold text-2xl">About</h3>
        <p className="text-md">{event.description}</p>
      </div>
      {/* Date and time */}
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center">
          <CalendarClock className="mr-2 w-8 h-8" />
          <h3 className="font-semibold text-2xl">Date and Time</h3>
        </div>
        <div>
          <div className="text-sm font-semibold">
            <div className="text-lg grid grid-cols-10 items-center">
              <div className="col-span-3 text-center border border-b-0 rounded-md rounded-bl-none rounded-tr-none rounded-br-none px-4 py-2">
                Starts
              </div>
              <div className="col-span-7 text-center border border-l-0 border-b-0 rounded-br-none rounded-tr-none rounded-md rounded-tl-none rounded-bl-none px-4 py-2">
                <time
                  dateTime={`${event.start_date}T${event.start_time}`}
                  className="font-normal"
                >
                  {format(
                    parse(event.start_date, "yyyy-MM-dd", Date.now()),
                    "PPP"
                  )}
                  {" - "}
                  {format(
                    parse(event.start_time, "HH:mm:ss", Date.now()),
                    "h a"
                  )}
                </time>
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold">
            <div className="text-lg grid grid-cols-10 items-center">
              <div className="col-span-3 text-center border rounded-md rounded-tl-none rounded-tr-none rounded-br-none px-4 py-2">
                Ends
              </div>
              <div className="col-span-7 text-center border border-l-0 rounded-md rounded-tl-none rounded-tr-none rounded-bl-none px-4 py-2">
                <time
                  dateTime={`${event.end_date}T${event.end_time}`}
                  className="font-normal"
                >
                  {format(
                    parse(event.end_date, "yyyy-MM-dd", Date.now()),
                    "PPP"
                  )}
                  {" - "}
                  {format(parse(event.end_time, "HH:mm:ss", Date.now()), "h a")}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <div className="border rounded-md text-center">
          {event.pricing_model !== "payf" ? (
            <p className="text-lg font-semibold grid grid-cols-10 min-h-full">
              <span className="border-r col-span-3 p-4">Price</span>
              <span className="col-span-7 p-4">
                {event.pricing_model === "free" && "Free"}
                {event.pricing_model === "paid" && `£${event.price / 100}`}
              </span>
            </p>
          ) : (
            <div className="border border-blue-300 rounded-md p-4">
              {event.pricing_model === "payf" && (
                <>
                  <p className="text-lg font-semibold text-center mb-2">
                    Choose your price
                  </p>
                  <p className="text-sm text-center leading-6">
                    This is a pay-as-you-feel event.
                    <br /> That means you decide how much to pay.
                    <br />
                    Please note that a minimum price may apply due to payment
                    processor fees
                  </p>
                </>
              )}
            </div>
          )}
        </div>
        {isPurchasableEvent(event) &&
          (event.pricing_model === "payf" ? (
            <PurchasePAYFEventButton user={user} event={event} />
          ) : (
            <PurchaseEventButton user={user} event={event} />
          ))}
        {!isPurchasableEvent(event) && (
          <p className="flex items-center justify-center w-full rounded-lg bg-primary text-primary-foreground p-4">
            This event has ended and is no longer available for purchase
          </p>
        )}
      </div>
    </div>
  );
}
