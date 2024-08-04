import { setGoogleRefreshToken } from "@/utils/google/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function handleGoogleSignInFlow(request: Request, code: string) {
  const requestUrl = new URL(request.url);
  const { origin } = requestUrl;

  const supabase = createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect("/");
  }

  const { session } = data;
  if (!session.provider_token || !session.provider_refresh_token) {
    return NextResponse.redirect(`${origin}/auth-error`);
  } else {
    await setGoogleRefreshToken(session.provider_refresh_token);
    cookies().set("g_access_token", session.provider_token, {
      httpOnly: true,
    });
    return NextResponse.redirect(
      `${origin}/${requestUrl.searchParams.get("return_to") ?? "/"}`
    );
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  const flow = requestUrl.searchParams.get("flow");

  //Redirect to error page if code is missing
  if (!code) return NextResponse.redirect(`${origin}/auth-code-error`);

  const allowedFlows = [
    "google-signin",
    "google-incremental-auth",
    "google-link-account",
    "signup",
  ];

  //validate the flow query parameter, redirect if not allowed
  if (!allowedFlows.find((allowedFlow) => allowedFlow === flow)) {
    return NextResponse.redirect(`${origin}/auth-error`);
  }

  switch (flow) {
    case "google-signin":
    case "google-incremental-auth":
    case "google-link-account":
      return handleGoogleSignInFlow(request, code);
  }
}
