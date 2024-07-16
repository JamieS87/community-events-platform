"use server";
import { loginFormSchema } from "@/components/forms/login-form-schema";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

type FlattenedZodErrors = z.inferFlattenedErrors<typeof loginFormSchema, { message: string }>;

export type SignInState = {
  message: string;
} | FlattenedZodErrors | null;

export const signIn = async (prev: SignInState, formData: FormData) => {

  const result = loginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if(!result.success) {
    const errors: FlattenedZodErrors = result.error.flatten((issue) => {
      return { message: issue.message };
    });
    return errors;
  }

  const supabase = createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (signInError) {
    //Handle invalid credentials and email confirmation messages
    if(/Invalid login credentials/.test(signInError.message) || /Email confirmation required/.test(signInError.message)) {
      return { message: signInError.message };
    }
    //Throw for unhandled errors
    throw signInError;
  }

  return redirect("/");
};

export const signUp = async (formData: FormData) => {

  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/");
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return redirect("/");
};

export const signInWithGoogle = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes:
        "https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile",
      redirectTo: "http://localhost:3000/auth/callback",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      },
    },
  });
  if (error) throw error;
  redirect(data.url);
};
