import { Tables } from "@/dbtypes";
import { createClient } from "../supabase/client";
import { isAfter, isBefore, parse } from "date-fns";

export const uploadEventThumbnail = async (
  file: File,
  upsert: boolean = true
) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("event-thumbnails")
    .upload(file.name, file, { upsert });
  if (error) {
    throw error;
  }

  return data;
};

export const isExpiredEvent = (
  event: Pick<
    Tables<"events">,
    "start_date" | "end_date" | "start_time" | "end_time"
  >
) => {
  const eventEndDateTime = parse(
    `${event.end_date} ${event.end_time}`,
    "yyyy-MM-dd HH:mm:ss",
    new Date()
  );
  if (isAfter(new Date(), eventEndDateTime)) {
    return true;
  }
  return false;
};

export const isInProgressEvent = (
  event: Pick<
    Tables<"events">,
    "start_date" | "start_time" | "end_date" | "end_time"
  >
) => {
  const eventStartDateTime = parse(
    `${event.start_date} ${event.start_time}`,
    "yyyy-MM-dd HH:mm:ss",
    Date.now()
  );
  return isBefore(eventStartDateTime, new Date()) && !isExpiredEvent(event);
};

export const isPurchasableEvent = (
  event: Pick<
    Tables<"events">,
    "start_date" | "start_time" | "end_date" | "end_time" | "published"
  >
) => {
  if (isExpiredEvent(event)) {
    return false;
  }
  if (isInProgressEvent(event)) {
    return false;
  }
  if (!event.published) {
    return false;
  }
  return true;
};
