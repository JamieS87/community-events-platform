"use server";

import {
  createStripeCustomer,
  deleteStripeCustomer,
  getStripeCustomerByCustomerId,
} from "@/utils/stripe/admin";
import {
  selectSupabaseCustomerIdByUserId,
  insertSupabaseCustomer,
  updateSupabaseCustomer,
} from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { z } from "zod";

const eventSchema = z.object({
  event_id: z.coerce.number().min(0),
  payf_price: z.coerce.number().positive().min(0.3).transform((v) => v * 100).optional()
});

export async function purchaseEvent(formData: FormData) {

  const eventValidationResult = eventSchema.safeParse(
    { 
      event_id: formData.get('event_id'),
      payf_price: formData.get('payf_price') || undefined
    }
  );

  if(!eventValidationResult.success) {
    return redirect("/checkout-error");
  }

  const validatedEventId = eventValidationResult.data.event_id;

  const supabase = createClient();

  //Get the event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", validatedEventId)
    .limit(1)
    .single();

  if(eventError || event === null) {
    if(eventError) {
      throw eventError;
    }
    if(!event) {
      throw Error("Expected event to not be null")
    }
  }


  if (!event.published) {
    return redirect("/checkout-error");
  }

  let eventPrice = event.price;

  if(event.pricing_model === 'payf') {
    if(eventValidationResult.data.payf_price === undefined) {
      throw Error("Encountered attempt to purchase pay as you feel event without providing a payf_price");
    } else {
      eventPrice = eventValidationResult.data.payf_price;
    }
  }

  const {
    data: { user }, error: getUserError
  } = await supabase.auth.getUser();
  if (!user || getUserError) {
    return redirect("checkout-error");
  }

  //Get the customer record for the user from supabase
  let customerId = await selectSupabaseCustomerIdByUserId(user.id);
  let isNewCustomer = false;

  if(customerId) {
    //We have a customer on the supabase side, so check that the customer exists on the stripe side
    const stripeCustomer = await getStripeCustomerByCustomerId(customerId);
    if(stripeCustomer === null || stripeCustomer.deleted) {
      //The customer doesn't exist, or has been deleted on the stripe side
      //So create a new customer and update the customer on the supabase side
      const newCustomer = await createStripeCustomer(user);
      try {
        await updateSupabaseCustomer(user.id, newCustomer.id);
        customerId = newCustomer.id;
        isNewCustomer = true;
      } catch(error) {
        //If we can't create the customer on the supabase side, clean up
        //by deleting the customer on the stripe side
        //then rethrow the error
        await deleteStripeCustomer(newCustomer.id);
        throw error;
      }
    }
  }

  if (!customerId) {
    //There was no customer on the supabase side, so create a new stripe customer
    //and a new supabase customer
    const customer = await createStripeCustomer(user);
    customerId = customer.id;
    try {
      //Create the customer in supabase
      await insertSupabaseCustomer(user.id, customerId);
    } catch (error) {
      //If we fail to create a supabase customer, clan up by deleting the stripe customer
      await deleteStripeCustomer(customerId);
      throw error;
    }
  }

  const { origin } = new URL(headers().get('origin') || '');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!);

  const eventLineItem = {
    quantity: 1,
    price_data: {
      currency: "GBP",
      unit_amount: eventPrice,
      product_data: {
        name: event.name ?? '',
        description: event.description,
        metadata: { event_id: event.id },
      },
    },
  };

  //Create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: customerId as string,
    cancel_url: origin,
    success_url: `${origin}/events/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    line_items: [eventLineItem],
    metadata: { event_id: event.id, user_id: user.id },
    mode: "payment",
  });

  if (!session.url) {
    return redirect(`${origin}/checkout-error`);
  }
  return redirect(session.url);
}
