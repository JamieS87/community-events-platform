import { Database, Tables } from "@/dbtypes";
import { createClient, User } from "@supabase/supabase-js";
import { format } from "date-fns";
import Stripe from "stripe";

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!!
);

export const selectSupabaseCustomerIdByUserId = async (userId: User["id"]) => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("customer_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data === null ? null : data.customer_id;
};

export const selectSupabaseUserIdByCustomerId = async (
  customerId: Stripe.Customer["id"]
) => {
  const { data: customer, error } = await supabaseAdmin
    .from("customers")
    .select("user_id")
    .eq("customer_id", customerId)
    .limit(1)
    .single();
  if (error) throw error;
  return customer.user_id;
};

export const insertSupabaseCustomer = async (
  user_id: User["id"],
  customer_id: Stripe.Customer["id"]
) => {
  const { error } = await supabaseAdmin
    .from("customers")
    .insert({ customer_id, user_id });
  if (error) {
    throw error;
  }
};

export const updateSupabaseCustomer = async (
  user_id: User["id"],
  customer_id: Stripe.Customer["id"]
) => {
  const { error } = await supabaseAdmin
    .from("customers")
    .update({ customer_id })
    .eq("user_id", user_id);
  if (error) {
    throw error;
  }
};

export const insertSupabasePurchasedEvent = async (
  user_id: User["id"],
  event_id: Tables<"events">["id"],
  wh_event_id: string,
  cs_id: string,
  amount_total: number | null,
  purchased_at: number
) => {
  const { data: eventData, error: getEventError } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  if (getEventError) {
    throw getEventError;
  }

  const event = eventData;

  const { error } = await supabaseAdmin.from("purchased_events").insert({
    user_id,
    event_id: Number(event.id),
    name: event.name,
    description: event.description,
    start_date: event.start_date,
    end_date: event.end_date,
    start_time: event.start_time,
    end_time: event.end_time,
    pricing_model: event.pricing_model,
    price: event.price,
    thumbnail: event.thumbnail,
    wh_event_id,
    cs_id,
    amount_total,
    purchased_at: format(new Date(purchased_at * 1000), "MM-dd-yyyy hh:mm:ss"),
  });
  if (error) {
    throw error;
  }
};

export const insertSupabaseCalendarEvent = async (
  user_id: User["id"],
  event_id: Tables<"events">["id"],
  calendar_event_id: string
) => {
  const { error } = await supabaseAdmin
    .from("calendar_events")
    .insert({ user_id, event_id, calendar_event_id });
  if (error) {
    throw error;
  }
};
