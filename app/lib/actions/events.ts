"use server";

import { createClient } from "@/utils/supabase/server";

import { createEventFormSchema } from "@/components/forms/create-event-form-schema";
import { format } from "date-fns";
import { Tables } from "@/dbtypes";
import { ZodIssue } from "zod";
import { revalidatePath } from "next/cache";

export async function createEvent(
  prev:
    | { code: string; payload: { issues: ZodIssue[] } }
    | { code: string; payload: Tables<"events"> }
    | null,
  formData: FormData
) {
  const result = createEventFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    const issues = result.error.issues;
    return { code: "error", payload: { issues } };
  }

  const supabase = createClient();
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert({
      ...result.data,
      price: result.data.price * 100,
      start_date: format(result.data.start_date, "yyyy-MM-dd"),
      end_date: format(result.data.end_date, "yyyy-MM-dd"),
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { code: "success", payload: newEvent };
}

export async function deleteEvent(eventId: Tables<"events">["id"]) {
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) {
    throw error;
  }
  revalidatePath("");
}

export async function publishEvent(eventId: Tables<"events">["id"]) {
  const supabase = createClient();

  const { error } = await supabase
    .from("events")
    .update({ published: true })
    .eq("id", eventId);

  if (error) {
    throw error;
  }
  revalidatePath("");
}

export async function unpublishEvent(eventId: Tables<"events">["id"]) {
  const supabase = createClient();

  const { error } = await supabase
    .from("events")
    .update({ published: false })
    .eq("id", eventId);

  if (error) {
    throw error;
  }
  revalidatePath("");
}
