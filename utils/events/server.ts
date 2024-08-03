import { createClient } from "../supabase/server";

export const getLatestEvents = async (limit: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,name,pricing_model,thumbnail,price,start_date")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .order("id")
    .limit(limit);

  if (error) {
    throw error;
  }
  return data;
};

export const getLatestFreeEvents = async (limit: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,name,pricing_model,thumbnail,price,start_date")
    .eq("published", true)
    .eq("pricing_model", "free")
    .order("created_at", { ascending: false })
    .order("id")
    .limit(limit);

  if (error) {
    throw error;
  }
  return data;
};

export const getLatestPAYFEvents = async (limit: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,name,pricing_model,thumbnail,price,start_date")
    .eq("published", true)
    .eq("pricing_model", "payf")
    .order("created_at", { ascending: false })
    .order("id")
    .limit(limit);

  if (error) {
    throw error;
  }
  return data;
};

export const getLatestPaidEvents = async (limit: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,name,pricing_model,thumbnail,price,start_date")
    .eq("published", true)
    .eq("pricing_model", "paid")
    .order("created_at", { ascending: false })
    .order("id")
    .limit(limit);

  if (error) {
    throw error;
  }
  return data;
};
