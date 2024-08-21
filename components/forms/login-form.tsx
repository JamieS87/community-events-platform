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
import { signIn, signInWithGoogle } from "@/app/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { loginFormSchema } from "@/components/forms/login-form-schema";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import GoogleIcon from "../google-icon";
import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();

  return (
    <Card className="max-w-md w-full my-auto border">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Log in or sign up for an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {"formErrors" in signInState && (
              <ul>
                {signInState.formErrors.map(({ message }, idx) => {
                  return <li key={idx}>{message}</li>;
                })}
              </ul>
            )}
            {"message" in signInState && (
              <p className="flex items-center justify-center border rounded-lg px-6 py-4 border-red-300 font-semibold">
                <AlertTriangle className="w-6 h-6 mr-2" />
                {signInState.message}
              </p>
            )}
          </div>
        )}
        <Form {...form}>
          <form className="flex flex-col space-y-4 w-full">
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
                      autoComplete="current-password"
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
            <Button variant="secondary" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </form>
        </Form>
        <form className="flex">
          <SubmitButton
            variant="outline"
            formAction={signInWithGoogle.bind(
              null,
              searchParams.get("next") ?? "/"
            )}
            loadingIcon={true}
            pendingText="Signing in with google"
            className="mx-auto"
          >
            <div className="w-6 h-6 mr-4 flex">
              <GoogleIcon />
            </div>
            Sign in with Google
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};
