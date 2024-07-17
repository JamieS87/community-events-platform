"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "@/app/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { loginFormSchema } from "@/components/forms/login-form-schema";

export const LoginForm = () => {
  const [signInState, signInAction] = useFormState(signIn, null);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    mode: "all",
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      {signInState && (
        <div role="alert" data-testid="signin-alert">
          {"fieldErrors" in signInState && (
            <ul>
              {Object.entries(signInState.fieldErrors).map(
                ([fieldName, errors]) => {
                  return (
                    <li key={fieldName}>
                      <ul>
                        {errors.map(({ message }, idx) => {
                          return <li key={`${fieldName}_${idx}`}>{message}</li>;
                        })}
                      </ul>
                    </li>
                  );
                }
              )}
            </ul>
          )}
          {"formErrors" in signInState && (
            <ul>
              {signInState.formErrors.map(({ message }, idx) => {
                return <li key={idx}>{message}</li>;
              })}
            </ul>
          )}
          {"message" in signInState && <p>{signInState.message}</p>}
        </div>
      )}
      <Form {...form}>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    data-testid="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••••"
                    {...field}
                    type="password"
                    data-testid="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            formAction={signInAction}
            pendingText="Logging in"
            disabled={!form.formState.isValid}
            data-testid="signin"
          >
            Login
          </SubmitButton>
        </form>
      </Form>
    </>
  );
};
