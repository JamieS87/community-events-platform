"use client";

import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = ButtonProps & {
  pending: boolean;
  pendingText?: string;
  loadingIcon?: boolean;
};

export function CreateEventSubmitButton({
  children,
  pending,
  pendingText,
  loadingIcon = false,
  ...props
}: Props) {
  return (
    <Button asChild variant={props.variant || "default"}>
      <button {...props} type="submit" aria-disabled={pending}>
        {pending && loadingIcon && (
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        )}
        {pending ? pendingText : children}
      </button>
    </Button>
  );
}
