import { setUsersGoogleTokens } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get("next") ?? "/";

  const flow = requestUrl.searchParams.get("flow");

  if (code) {
    const supabase = createClient();
    const {
      data: { session, user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);
    console.log(session);
    if (error || !user || !session)
      return NextResponse.redirect(`${origin}/auth-code-error`);

    if (flow && flow === "google") {
      if (!session.provider_token || !session.provider_refresh_token) {
        return NextResponse.redirect(`${origin}/auth-code-error`);
      }

      //Refresh the session to remove provider_token and provider_refresh_token
      //from the response cookies
      const {
        data: { session: refreshedSession },
      } = await supabase.auth.refreshSession(session);

      try {
        await setUsersGoogleTokens(
          user,
          session?.provider_token,
          session?.provider_refresh_token
        );
      } catch (error) {
        return NextResponse.redirect(`${origin}/auth-code-error`);
      }
    }
    return NextResponse.redirect(`${origin}/${next}`);
  }
  return NextResponse.redirect(`${origin}/auth-code-error`);
}
