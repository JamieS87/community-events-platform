"use server";
import { loginFormSchema } from "@/components/forms/login-form-schema";
import { signUpFormSchema } from "@/components/forms/signup-form-schema";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

type FlattenedZodLoginErrors = z.inferFlattenedErrors<typeof loginFormSchema, { message: string }>;

export type SignInState = {
  message: string;
} | FlattenedZodLoginErrors | null;

export const signIn = async (prev: SignInState, formData: FormData) => {

  const result = loginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if(!result.success) {
    const errors: FlattenedZodLoginErrors = result.error.flatten((issue) => {
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

type FlattenedZodSignUpErrors = z.inferFlattenedErrors<typeof signUpFormSchema, { message: string }>;

export type SignUpState = {
  message: string;
} | FlattenedZodSignUpErrors | null;


export const signUp = async (prev: SignUpState, formData: FormData) => {

  const origin = headers().get('origin');

  const result = signUpFormSchema.safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordRepeat: formData.get('passwordRepeat')
  });

  if(!result.success) {
    const errors: FlattenedZodSignUpErrors = result.error.flatten((issue) => {
      return { message: issue.message };
    });
    return errors;
  }

  const supabase = createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        first_name: result.data.firstname,
        last_name: result.data.lastname
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    return { message: signUpError.message };
  }

  return redirect(`/signup/confirm?email=${result.data.email}`);
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
