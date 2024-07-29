"use client";

import { Tables } from "@/dbtypes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function UnpublishEventButton({
  eventId,
}: {
  eventId: Tables<"events">["id"];
}) {
  const [unpublishConfirmOpen, setunpublishConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <AlertDialog
      open={unpublishConfirmOpen}
      onOpenChange={setunpublishConfirmOpen}
    >
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          {pending ? (
            <div>
              Unpublishing...
              <Loader2 className="ml-4 w-4 h-4" />
            </div>
          ) : (
            "Unpublish"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unpublish Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Unublishing an event will make it unviewable and unpurchasable by
            the public.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setPending(true);
              const supabase = createClient();
              const { error } = await supabase
                .from("events")
                .update({ published: false })
                .eq("id", eventId);
              if (error) {
                throw error;
              }
              setPending(false);
              setunpublishConfirmOpen(false);
              router.refresh();
            }}
          >
            Unpublish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
