"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

type PurchaseEventButtonProps = {
  user: User | null;
  event: Record<string, any>;
};

export default function PurchaseEventButton({
  user,
  event,
}: PurchaseEventButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <form action="/events/checkout" method="POST">
      <input type="hidden" name="event_id" value={event.id} />
      <Button
        onClick={async (e) => {
          if (!user) {
            e.preventDefault();
            return router.replace(`/login?next=${pathname}`);
          } else {
            e.currentTarget.form?.requestSubmit();
          }
        }}
      >
        Buy
      </Button>
    </form>
  );
}
