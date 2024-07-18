import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
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

  const { data: event, error: getEventError } = await supabase
    .from("events")
    .select("*")
    .limit(1)
    .eq("id", checkoutSession.metadata?.event_id ?? "")
    .single();



  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle className="text-center">Purchase Complete</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <p className="text-center">
          A receipt containing details of your purchase will be sent to{" "}
          <span className="text-xl font-semibold block">
            {checkoutSession.customer_details?.email}
          </span>
        </p>
        <div className="flex flex-col space-y-2">
          <p>Purchase Details</p>
          <p className="font-semibold">{event?.name}</p>
          <p>{event?.description}</p>
          <p>
            Paid:{" "}
            {checkoutSession.amount_total !== null &&
              checkoutSession.amount_total / 100}{" "}
            {checkoutSession.currency}
          </p>
        </div>
        <p className="mx-auto flex flex-col items-center">
          <Button variant="link" asChild>
            <Link href="/profile">View your purchases</Link>
          </Button>{" "}
          <span className="block text-sm">
            Note: purchases may not appear immediately
          </span>
        </p>
        <Button asChild><Link href="/">Home</Link></Button>
      </CardContent>
    </Card>
  );
}
