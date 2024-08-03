"use server";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import PricingModelBadge from "@/components/pricing-model-badge";
import { Tables } from "@/dbtypes";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export default async function EventCard({
  event,
}: {
  event: Pick<
    Tables<"events">,
    | "id"
    | "name"
    | "pricing_model"
    | "thumbnail"
    | "start_date"
    | "price"
    | "pricing_model"
  >;
}) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="w-full rounded-sm">
        <CardHeader className="flex flex-row items-center p-2">
          <CardTitle className="flex-1 text-lg">{event.name}</CardTitle>

        </CardHeader>
        <CardContent className="p-2">
          {event.thumbnail && (
            <Image
              src={`http://127.0.0.1:54321/storage/v1/object/public/${event.thumbnail}`}
              alt={`${event.name} thumbnail image`}
              className="w-full aspect-video object-cover"
              width={1024}
              height={1024}
            />
          )}
          {!event.thumbnail && <div className="aspect-video w-full"></div>}
          <div className="flex items-center text-sm font-semibold mt-2 justify-between px-2">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {format(event.start_date, "PPP")}
            </span>
            {(event.pricing_model === "free" ||
              event.pricing_model === "payf") && (
              <PricingModelBadge
                pricing_model={event.pricing_model}
                variant={"secondary"}
              />
            )}
            {event.pricing_model === "paid" && (
              <span className="text-lg">£{event.price / 100}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export const LoadingEventCard = async () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="animate-pulse w-[100px] h-10 bg-gray-100"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full aspect-video max-w-[1024px] max-h-[1024px] animate-pulse bg-gray-100"></div>
      </CardContent>
    </Card>
  );
};
