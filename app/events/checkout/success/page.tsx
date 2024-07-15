import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/checkout-error");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!!);
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    searchParams.session_id
  );

  console.dir(checkoutSession, { depth: 5 });

  return <h2>Thankyou {searchParams.session_id}</h2>;
}
