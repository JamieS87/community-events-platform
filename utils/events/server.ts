import { createClient } from "../supabase/server";

export const getLatestEvents = async (limit: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,name,pricing_model,thumbnail")
    .order("created_at", { ascending: false })
    .order("id")
    .limit(limit);

  if (error) {
    throw error;
  }
  return data;
};
