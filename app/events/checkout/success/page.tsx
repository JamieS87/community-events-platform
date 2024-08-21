import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import Image from "next/image";
import { format, parse } from "date-fns";
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
    .eq("id", checkoutSession.metadata?.event_id ?? "")
    .limit(1)
    .single();

  if (getEventError || !event) {
    throw Error(
      "Couldn't get supabase event from completed checkout session event id"
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-2xl w-full mt-10">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            Purchase Complete
            <CheckCircle className="w-8 h-8 ml-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p className="text-center">
            A receipt containing details of your purchase will be sent to{" "}
            <span className="text-lg font-semibold block">
              {checkoutSession.customer_details?.email}
            </span>
          </p>
          <div className="flex flex-col space-y-2">
            <p className="font-semibold text-xl border-b pb-4">
              Purchase Details
            </p>
            <p className="font-semibold">{event.name}</p>
            <Image
              src={`${process.env.NEXT_PUBLIC_OBJECT_STORAGE_URL}/${event.thumbnail}`}
              width={1024}
              height={1024}
              className="max-w-sm aspect-video object-cover"
              alt={`${event.name} thumbnail image`}
            />
            <p className="font-semibold">
              Paid:{" "}
              <span className="font-normal">
                {checkoutSession.amount_total !== null &&
                  checkoutSession.amount_total / 100}{" "}
                {checkoutSession.currency?.toUpperCase()}
              </span>
            </p>
            <p className="font-semibold">
              Starts{" "}
              {format(parse(event.start_date, "yyyy-MM-dd", Date.now()), "PPP")}
            </p>
            <p className="font-semibold">
              Ends{" "}
              {format(parse(event.end_date, "yyyy-MM-dd", Date.now()), "PPP")}
            </p>
          </div>
          <p className="mx-auto flex flex-col items-center">
            <Button variant="link" asChild>
              <Link href="/profile">View your purchases</Link>
            </Button>{" "}
          </p>
          <Button asChild>
            <Link href="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
