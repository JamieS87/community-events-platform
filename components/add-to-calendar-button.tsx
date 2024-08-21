"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./submit-button";
import { addEventToCalendar } from "@/app/lib/actions/calendar";
import { Tables } from "@/dbtypes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  requestCalendarEventsScope,
  requestLinkGoogleIdentity,
} from "@/app/lib/actions/auth";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, CalendarCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useToast } from "./ui/use-toast";

export default function AddToCalendarButton({
  event_id,
  isInCalendar,
}: {
  event_id: Tables<"events">["id"];
  isInCalendar: boolean;
}) {
  const { toast } = useToast();
  const [state, addEventToCalendarAction] = useFormState(
    addEventToCalendar.bind(null, event_id),
    null
  );

  const [googleIdentityRequired, setGoogleIdentityRequired] = useState(false);
  const [scopesRequired, setScopesRequired] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (state?.code === "success") {
      toast({
        title: "Event Added To Calendar",
        description: "Event successfully added to calendar",
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (state !== null) {
      switch (state.code) {
        case "google_identity_required":
          setGoogleIdentityRequired(true);
          break;
        case "scopes_required":
          setScopesRequired(true);
          break;
      }
    }
  }, [state, router, pathname]);

  return (
    <>
      <GoogleAccountPromptDialog
        open={googleIdentityRequired}
        onOpenChange={(open) => !open && setGoogleIdentityRequired(false)}
        onConfirm={() => requestLinkGoogleIdentity(pathname)}
      />
      <GoogleScopesPromptDialog
        open={scopesRequired}
        onOpenChange={(open) => !open && setScopesRequired(false)}
        onConfirm={() => requestCalendarEventsScope(pathname)}
      />
      {scopesRequired && (
        <p>
          Additional scopes required{" "}
          <Button
            onClick={async () => {
              requestCalendarEventsScope(pathname);
            }}
          >
            Grant additional scopes
          </Button>
        </p>
      )}
      {isInCalendar ? (
        <div className="text-primary-foreground rounded-md text-sm font-medium bg-blue-700 px-4 py-2 h-10 inline-flex items-center">
          Added to calendar
          <CalendarCheck className="w-4 h-4 md:ml-4" />
        </div>
      ) : (
        <form>
          <SubmitButton
            formAction={addEventToCalendarAction}
            pendingText="Please wait..."
            loadingIcon={true}
          >
            Add to Calendar
            <Calendar className="w-4 h-4 md:ml-4" />
          </SubmitButton>
        </form>
      )}
    </>
  );
}

type GoogleAccountPromptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const GoogleAccountPromptDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: GoogleAccountPromptDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Google Account Required</AlertDialogTitle>
          <AlertDialogDescription>
            A Google account is required to add events to your calendar. Click
            continue to Link a Google account and add events to your Google
            calendar
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              onConfirm();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type GoogleScopesPromptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const GoogleScopesPromptDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: GoogleScopesPromptDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Google Calendar Permissions Required
          </AlertDialogTitle>
          <AlertDialogDescription>
            In order to add events to your calendar, we need your permission to
            access your Google calendar events.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              onConfirm();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
