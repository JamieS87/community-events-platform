import { Database, Tables } from "@/dbtypes";
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

// export const supabaseDeleteUserCalendarEvents = async (
//   user_id: User["id"],
//   calendarEventIds: string[]
// ) => {
//   const { error } = await supabaseAdmin
//     .from("calendar_events")
//     .delete()
//     .eq("user_id", user_id)
//     .in("calendar_event_id", calendarEventIds);
//   if (error) {
//     throw error;
//   }
// };

// export const setUserGoogleTokens = async (
//   user: User,
//   access_token: string,
//   refresh_token: string
// ) => {
//   const {
//     data: { user: updatedUser },
//     error,
//   } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
//     app_metadata: {
//       google_access_token: access_token,
//       google_refresh_token: refresh_token,
//     },
//   });
//   if (error) {
//     throw error;
//   }
//   return updatedUser;
// };

// export const getUserGoogleTokens = async (user: User) => {
//   const access_token = user.app_metadata.google_access_token;
//   const refresh_token = user.app_metadata.google_refresh_token;
//   return { access_token, refresh_token };
// };
