"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = ButtonProps & {
  pendingText?: string;
  loadingIcon?: boolean;
};

export function SubmitButton({
  children,
  pendingText,
  loadingIcon = false,
  ...props
}: Props) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <Button asChild variant={props.variant || "default"}>
      <button {...props} type="submit" aria-disabled={pending}>
        {isPending && loadingIcon && (
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        )}
        {isPending ? pendingText : children}
      </button>
    </Button>
  );
}
