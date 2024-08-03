"use client";

import { forwardRef } from "react";
import { Button } from "./ui/button";
import { signOut } from "@/app/lib/actions/auth";

const SignOutButton = forwardRef<HTMLButtonElement>((_, ref) => {
  return (
    <Button
      ref={ref}
      className="w-full"
      size="sm"
      onClick={async () => {
        await signOut();
      }}
    >
      Sign out
    </Button>
  );
});
SignOutButton.displayName = "SignoutButton";

export default SignOutButton;
