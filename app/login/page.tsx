"use client";

import { useFormState } from "react-dom";
import { signIn, signUp, signInWithGoogle } from "../lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { useEffect, useState } from "react";
import { isAuthApiError } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const loginRedirect = useSearchParams().get("next") ?? "/";
  const [signInState, signInAction] = useFormState(signIn, {});

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(signInState).length) {
      if (isAuthApiError(signInState)) {
        setErrorMessage("Please check your login details and try again");
      }
    }
  }, [signInState]);

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          data-testid="email"
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          data-testid="password"
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signInAction}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
          data-testid="signin"
        >
          Sign In
        </SubmitButton>
        {errorMessage && <p>{errorMessage}</p>}
        <SubmitButton
          variant="secondary"
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        <Button
          variant="secondary"
          onClick={async (e) => {
            e.preventDefault();
            await signInWithGoogle();
          }}
        >
          Sign in with Google
        </Button>
      </form>
    </div>
  );
}
