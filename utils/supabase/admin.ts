import { Database } from "@/dbtypes";
import { createClient, User } from "@supabase/supabase-js";
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
    .update({ customer_id }).eq('user_id',user_id);
  if (error) {
    throw error;
  }
};

export const insertSupabasePurchasedEvent = async (
  user_id: User["id"],
  event_id: string,
  wh_event_id: string,
  cs_id: string
) => {
  const { data: purchasedEvent, error } = await supabaseAdmin
    .from("purchased_events")
    .insert({ user_id, event_id: Number(event_id), wh_event_id, cs_id });
  if (error) {
    throw error;
  }
};
