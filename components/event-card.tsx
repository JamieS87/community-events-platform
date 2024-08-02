"use server";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import PricingModelBadge from "@/components/pricing-model-badge";
import { Tables } from "@/dbtypes";

export default async function EventCard({
  event,
}: {
  event: Pick<Tables<"events">, "id" | "name" | "pricing_model" | "thumbnail">;
}) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="flex-1">{event.name}</CardTitle>
          <PricingModelBadge
            pricing_model={event.pricing_model}
            variant={"secondary"}
          />
        </CardHeader>
        <CardContent>
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
