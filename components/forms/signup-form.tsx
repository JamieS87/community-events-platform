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
import { signUp } from "@/app/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { signUpFormSchema } from "@/components/forms/signup-form-schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SignUpForm = () => {
  const [signUpState, signUpAction] = useFormState(signUp, null);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    mode: "all",
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      passwordRepeat: "",
    },
  });

  return (
    <Card className="max-w-md w-full my-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {signUpState && (
          <div
            className="flex items-center justify-center p-4 border border-red-800 rounded-lg font-semibold animate-accordion-down"
            role="alert"
            data-testid="signup-alert"
          >
            {"fieldErrors" in signUpState && (
              <ul>
                {Object.entries(signUpState.fieldErrors).map(
                  ([fieldName, errors]) => {
                    return (
                      <li key={fieldName}>
                        <ul>
                          {errors.map(({ message }, idx) => {
                            return (
                              <li key={`${fieldName}_${idx}`}>{message}</li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  }
                )}
              </ul>
            )}
            {"formErrors" in signUpState && (
              <ul>
                {signUpState.formErrors.map(({ message }, idx) => {
                  return <li key={idx}>{message}</li>;
                })}
              </ul>
            )}
            {"message" in signUpState && <p>{signUpState.message}</p>}
          </div>
        )}
        <Form {...form}>
          <form className="flex flex-col space-y-4 max-w-sm w-full">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Joe"
                      {...field}
                      data-testid="firstname"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="bloggs"
                      {...field}
                      data-testid="lastname"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      type="email"
                      data-testid="email"
                      autoComplete="email"
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
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••••"
                      {...field}
                      type="password"
                      data-testid="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordRepeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••••"
                      {...field}
                      type="password"
                      data-testid="password-repeat"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage className="text-red-700" />
                </FormItem>
              )}
            />
            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up"
              disabled={!form.formState.isValid}
              data-testid="signup-submit"
            >
              Sign up
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
