"use client";

import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { Database } from "@/dbtypes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { purchaseEvent } from "@/app/lib/actions/checkout";
import { SubmitButton } from "./submit-button";

const payfSchema = z.object({
  payf_price: z.coerce
    .number()
    .min(0.3, { message: "Price must be at least 0.3" }),
  event_id: z.string(),
});

type PurchaseEventButtonProps = {
  user: User | null;
  event: Database["public"]["Tables"]["events"]["Row"];
  [k: string]: any;
};

export default function PurchasePAYFEventButton({
  user,
  event,
  ...props
}: PurchaseEventButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof payfSchema>>({
    mode: "all",
    resolver: zodResolver(payfSchema),
    defaultValues: {
      payf_price: 0.3,
      event_id: String(event.id),
    },
  });

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-y-6">
        <FormField
          control={form.control}
          name="payf_price"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col mx-auto max-w-xl text-xl">
                <div className="flex w-full">
                  <div className="flex items-center font-semibold min-h-full px-4 rounded-tl-md rounded-bl-md border-t border-b border-l border-r">
                    £
                  </div>
                  <FormLabel className="sr-only">Price</FormLabel>
                  <FormControl className="flex items-center font-semibold min-h-full px-4 rounded-tl-md rounded-bl-md border-t border-b border-l border-r">
                    <Input
                      data-testId="payf-price"
                      className="border-l-0 rounded-tl-none rounded-bl-none w-full text-xl"
                      type="number"
                      placeholder="1.00"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>
        <input type="hidden" name="event_id" value={event.id} />
        <SubmitButton
          className="w-full"
          disabled={!form.formState.isValid}
          formAction={purchaseEvent.bind(null, `/events/${event.id}`)}
          {...props}
          data-testid="purchase-event"
          onClick={async (e) => {
            if (!user) {
              e.preventDefault();
              return router.replace(`/login?next=${pathname}`);
            }
          }}
          pendingText="Please Wait"
          loadingIcon={true}
        >
          Buy
        </SubmitButton>
      </form>
    </Form>
  );
}
