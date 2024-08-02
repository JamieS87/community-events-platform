"use client";

import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { Database } from "@/dbtypes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { purchaseEvent } from "@/app/lib/actions/checkout";
import { SubmitButton } from "./submit-button";

const formSchema = z.object({
  event_id: z.string(),
});

type PurchaseEventButtonProps = {
  user: User | null;
  event: Database["public"]["Tables"]["events"]["Row"];
  [k: string]: any;
};

export default function PurchaseEventButton({
  user,
  event,
  ...props
}: PurchaseEventButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_id: String(event.id),
    },
  });

  return (
    <Form {...form}>
      <form className="w-full">
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
