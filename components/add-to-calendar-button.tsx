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
import { usePathname } from "next/navigation";
import { Calendar, CalendarCheck } from "lucide-react";

export default function AddToCalendarButton({
  event_id,
}: {
  event_id: Tables<"events">["id"];
}) {
  const [state, addEventToCalendarAction] = useFormState(
    addEventToCalendar.bind(null, event_id),
    null
  );

  const [added, setAdded] = useState(false);
  const [googleIdentityRequired, setGoogleIdentityRequired] = useState(false);
  const [scopesRequired, setScopesRequired] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (state !== null) {
      switch (state.code) {
        case "success":
          setAdded(true);
          break;
        case "google_identity_required":
          setGoogleIdentityRequired(true);
          break;
        case "scopes_required":
          setScopesRequired(true);
          break;
      }
    }
  }, [state, event_id]);

  return (
    <>
      {googleIdentityRequired && (
        <p>
          Link a google account{" "}
          <Button
            onClick={async () => {
              requestLinkGoogleIdentity(pathname);
            }}
          ></Button>
        </p>
      )}
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
      {added ? (
        <div className="text-primary-foreground rounded-md text-sm font-medium bg-blue-700 px-4 py-2 h-10 inline-flex items-center">
          Added to calendar <CalendarCheck className="w-4 h-4 ml-4" />
        </div>
      ) : (
        <form>
          <SubmitButton
            formAction={addEventToCalendarAction}
            pendingText="Please wait..."
            loadingIcon={true}
          >
            Add to Calendar
            <Calendar className="w-4 h-4 ml-4" />
          </SubmitButton>
        </form>
      )}
    </>
  );
}
