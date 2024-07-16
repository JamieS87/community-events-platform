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
    <>
      {signUpState && (
        <div role="alert" data-testid="signup-alert">
          {"fieldErrors" in signUpState && (
            <ul>
              {Object.entries(signUpState.fieldErrors).map(
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
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="Joe" {...field} data-testid="firstname" />
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
                <FormLabel>Last name</FormLabel>
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
                <FormLabel>Email</FormLabel>
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
          <FormField
            control={form.control}
            name="passwordRepeat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••••"
                    {...field}
                    type="password"
                    data-testid="password-repeat"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
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
    </>
  );
};
