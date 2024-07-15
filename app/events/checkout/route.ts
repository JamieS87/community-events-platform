import {
  createStripeCustomer,
  deleteStripeCustomer,
} from "@/utils/stripe/admin";
import {
  selectSupabaseCustomerIdByUserId,
  insertSupabaseCustomer,
} from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function POST(request: Request) {
  const formData = await request.formData();
  const eventId = formData.get("event_id");
  if (!eventId) return redirect("/checkout-error");
  const supabase = createClient();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();
  if (eventError) {
    console.log(eventError);
    return redirect("/checkout-error");
  }
  if (!event.published) {
    console.log("Event not published");
    return redirect("/checkout-error");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  //Get the customer record for the user from supabase
  let customerId = await selectSupabaseCustomerIdByUserId(user.id);

  if (!customerId) {
    //If there is no customer for the user in supabase, create one in stripe
    const customer = await createStripeCustomer(user);
    customerId = customer.id;
    console.log("Got stripe customer id: ", customerId);
    try {
      //Create the customer in supabase
      await insertSupabaseCustomer(user.id, customerId);
    } catch (error) {
      //If an error is thrown, clean up by deleting the customer we created in stripe
      //and rethrow the error
      await deleteStripeCustomer(customerId);
      throw error;
    }
  }

  const { origin } = new URL(request.url);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!);

  const eventLineItem = {
    quantity: 1,
    price_data: {
      currency: "GBP",
      unit_amount: event.price,
      product_data: {
        name: event.name,
        description: event.description,
        metadata: { event_id: event.id },
      },
    },
  };

  //Create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal"],
    customer: customerId as string,
    cancel_url: origin,
    success_url: `${origin}/events/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    line_items: [eventLineItem],
    metadata: { event_id: event.id, user_id: user.id },
    mode: "payment",
  });

  if (!session.url) {
    return redirect(`${origin}/checkout-session-error`);
  }
  return redirect(session.url);
}
