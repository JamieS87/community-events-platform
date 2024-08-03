import Link from "next/link";
import SiteAuth from "./site-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { hasStaffClaim } from "@/app/lib/utils";

export default async function SiteNav() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const { data: sessionData, error: getSessionError } =
    await supabase.auth.getSession();
  if (getSessionError) {
    return redirect("/login");
  }

  const isStaff = sessionData.session
    ? hasStaffClaim(sessionData.session)
    : false;

  return (
    <nav className="w-full flex items-center justify-center border-b">
      {/* left */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center p-2">
        <div className="w-full flex items-center">
          <div className="flex-1 flex items-center">
            <Link href="/" className="font-bold text-2xl">
              CEP
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <SiteAuth user={data.user} isStaff={isStaff} />
          </div>
        </div>
      </div>
    </nav>
  );
}
