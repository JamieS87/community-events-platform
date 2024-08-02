import {
  insertSupabasePurchasedEvent,
  selectSupabaseUserIdByCustomerId,
} from "@/utils/supabase/admin";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!);
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!!;
  const payload = await request.text();
  const signature = headers().get("stripe-signature") ?? "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeWebhookSecret
    );
  } catch (error: any) {
    return new Response(
      `Encountered an error processing webhook: ${error.message}`,
      {
        status: 400,
      }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object;
      const customerId = checkoutSession.customer;
      let userId: string;
      try {
        userId = await selectSupabaseUserIdByCustomerId(customerId as string);
      } catch (error) {
        return new Response(
          "Unable to retrieve the customer from internal system",
          { status: 400 }
        );
      }
      try {
        await insertSupabasePurchasedEvent(
          userId,
          (checkoutSession.metadata as Record<string, any>).event_id,
          event.id,
          checkoutSession.id
        );
        return new Response(null, { status: 200 });
      } catch (error) {
        return new Response("Unable to insert purchased event", {
          status: 400,
        });
      }
  }
  return new Response("unhandled webhook event type", { status: 400 });
}
