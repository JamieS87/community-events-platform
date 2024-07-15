import { User } from "@supabase/auth-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!);

export const createStripeCustomer = async (user: User) => {
  const customer = await stripe.customers.create({
    metadata: { user_id: user.id },
  });
  return customer;
};

export const deleteStripeCustomer = async (
  customer_id: Stripe.Customer["id"]
) => {
  const { deleted } = await stripe.customers.del(customer_id);
  return deleted;
};
