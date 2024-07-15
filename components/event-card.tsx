"use server";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
        <CardContent>{event.description}</CardContent>
      </Card>
    </Link>
  );
}
