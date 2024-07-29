"use server";

import { createClient } from "@/utils/supabase/server";

import { createEventFormSchema } from "@/components/forms/create-event-form-schema";
import { format } from "date-fns";
import { Tables } from "@/dbtypes";

export async function createEvent(
  prev:
    | { code: string, payload: string }
    | { code: string, payload: Tables<"events"> }
    | null,
  formData: FormData
) {
  const result = createEventFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return { code: "error", payload: JSON.stringify(result.error) };
  }

  const supabase = createClient();
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert({
      ...result.data,
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
