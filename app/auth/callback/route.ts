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
    cookies().set("g_access_token", session.provider_token, {
      httpOnly: true,
    });
    cookies().set("g_refresh_token", session.provider_refresh_token, {
      httpOnly: true,
    });
    return NextResponse.redirect(
      `${origin}${requestUrl.searchParams.get("return_to") ?? "/"}`
    );
  }
}

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  const flow = requestUrl.searchParams.get("flow");

  if (code) {
    if (
      flow === "google-signin" ||
      flow === "google-incremental-auth" ||
      flow === "google-link-account"
    ) {
      return handleGoogleSignInFlow(request, code);
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    const { user, session } = data;

    if (error || !user || !session) {
      throw error;
    }

    const returnTo = requestUrl.searchParams.get("return_to");
    return NextResponse.redirect(`${origin}${returnTo ?? ""}`);
  }

  return NextResponse.redirect(`${origin}/auth-code-error`);
}
