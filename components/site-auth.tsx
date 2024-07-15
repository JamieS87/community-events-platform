import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import Link from "next/link";
import AuthUserMenu from "./auth-user-menu";

export default async function SiteAuth() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <AuthUserMenu user={user} />
  ) : (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
