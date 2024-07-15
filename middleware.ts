import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";
import { hasStaffClaim } from "./app/lib/utils";

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);

  const redirectUrl = request.nextUrl.clone();

  const requiresAuthentication = ["/admin", "/profile", "/checkout/session"];

  if (
    requiresAuthentication.some((route) => {
      return request.nextUrl.pathname.startsWith(route);
    })
  ) {
    if (!user) {
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      //User isn't authenticated so redirect to login
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    if (hasStaffClaim(session)) {
      //User is authenticated and authorized, continue to the requested url
      return response;
    } else {
      //User is authenticated by not authorized. Redirect to index
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
