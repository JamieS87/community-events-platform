"use server";
import { loginFormSchema } from "@/components/forms/login-form-schema";
import { signUpFormSchema } from "@/components/forms/signup-form-schema";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

type FlattenedZodLoginErrors = z.inferFlattenedErrors<
  typeof loginFormSchema,
  { message: string }
>;

export type SignInState =
  | {
      message: string;
    }
  | FlattenedZodLoginErrors
  | null;

export const signIn = async (prev: SignInState, formData: FormData) => {
  const result = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
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
    if (
      /Invalid login credentials/.test(signInError.message) ||
      /Email confirmation required/.test(signInError.message)
    ) {
      return { message: signInError.message };
    }
    //Throw for unhandled errors
    throw signInError;
  }

  return redirect("/");
};

type FlattenedZodSignUpErrors = z.inferFlattenedErrors<
  typeof signUpFormSchema,
  { message: string }
>;

export type SignUpState =
  | {
      message: string;
    }
  | FlattenedZodSignUpErrors
  | null;

export const signUp = async (prev: SignUpState, formData: FormData) => {
  const result = signUpFormSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordRepeat: formData.get("passwordRepeat"),
  });

  if (!result.success) {
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
        last_name: result.data.lastname,
      },
      emailRedirectTo: `${getURL()}auth/email-confirmed`,
    },
  });

  if (signUpError) {
    if (/User already registered/.test(signUpError.message)) {
      return { message: signUpError.message };
    }
    throw signUpError;
  }

  return redirect(`/signup/confirm?email=${result.data.email}`);
};

export const signOut = async () => {
  const supabase = createClient();
  cookies().delete("g_access_token");
  cookies().delete("g_refresh_token");
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  revalidatePath("/");
  return redirect("/");
};

export const signInWithGoogle = async (return_to: string = "/") => {
  const origin = headers().get("origin");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes:
        "https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile",
      redirectTo: `${getURL()}auth/callback?flow=google-signin&return_to=${return_to}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      },
    },
  });
  if (error) throw error;
  return redirect(data.url);
};

export const requestCalendarEventsScope = async (return_to: string = "/") => {
  const origin = headers().get("origin");
  const supabase = createClient();

  const { data: userData, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    return redirect("/login");
  }

  const user = userData.user;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar.events",
      redirectTo: `${getURL()}auth/callback?flow=google-incremental-auth&return_to=${return_to}`,
      queryParams: {
        access_type: "offline",
        include_granted_scopes: "true",
        login_hint: user.email ?? "",
      },
    },
  });

  if (error) throw error;
  return redirect(data.url);
};

export const requestLinkGoogleIdentity = async (return_to: string = "/") => {
  const origin = headers().get("origin");
  const supabase = createClient();

  const { error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    return redirect("/login");
  }

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar.events",
      redirectTo: `${getURL()}auth/callback?flow=google-link-account&return_to=${return_to}`,
      queryParams: {
        prompt: "consent",
        access_type: "offline",
        include_granted_scopes: "true",
      },
    },
  });

  if (error) throw error;
  return redirect(data.url);
};
