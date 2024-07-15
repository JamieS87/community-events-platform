import { User } from "@supabase/auth-js";
import SignOutButton from "./sign-out-button";
import { createClient } from "@/utils/supabase/server";
import { hasStaffClaim } from "@/app/lib/utils";
import Link from "next/link";

export default async function AuthUserMenu({ user }: { user: User }) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isStaff = session && hasStaffClaim(session);

  return (
    <>
      <div>welcome {user.email ? user.email : ""}</div>
      {isStaff && <Link href="/admin">Admin</Link>}
      <SignOutButton />
    </>
  );
}
