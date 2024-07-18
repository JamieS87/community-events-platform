import { User } from "@supabase/auth-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!);

export const createStripeCustomer = async (user: User) => {
  const customer = await stripe.customers.create({
    ...(user.email && { email: user.email}),
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

export const getStripeCustomerByCustomerId = async (
  customer_id: Stripe.Customer["id"]
) => {
  try {
  const customer = await stripe.customers.retrieve(customer_id);
  return customer;
  } catch (error) {
    if(error instanceof Stripe.errors.StripeInvalidRequestError) {
      if(error.code === 'resource_missing') {
        return null;
      }
    }
    throw error;
  }
};