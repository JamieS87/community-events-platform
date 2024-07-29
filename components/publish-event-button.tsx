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

export default function PublishEventButton({
  eventId,
}: {
  eventId: Tables<"events">["id"];
}) {
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <AlertDialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default">
          {pending ? (
            <div>
              Publishing...
              <Loader2 className="ml-4 w-4 h-4" />
            </div>
          ) : (
            "Publish"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish Event?</AlertDialogTitle>
          <AlertDialogDescription>
            Publishing an event will make it viewable by the public.
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
                .update({ published: true })
                .eq("id", eventId);
              if (error) {
                throw error;
              }
              setPending(false);
              setPublishConfirmOpen(false);
              router.refresh();
            }}
          >
            Publish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
