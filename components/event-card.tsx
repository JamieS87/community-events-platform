"use server";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

export default async function EventCard({
  event,
}: {
  event: Record<string, any>;
}) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
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
          {event.description}
        </CardContent>
      </Card>
    </Link>
  );
}
