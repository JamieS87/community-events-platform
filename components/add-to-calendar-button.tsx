"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "./submit-button";
import { addEventToCalendar } from "@/app/lib/actions/calendar";

export default function AddToCalendarButton() {
  const [state, addEventToCalendarAction] = useFormState(
    addEventToCalendar,
    null
  );
  return (
    <form>
      <SubmitButton formAction={addEventToCalendarAction}>
        Add to Calendar
      </SubmitButton>
    </form>
  );
}
