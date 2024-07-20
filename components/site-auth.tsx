import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import Link from "next/link";
import AuthUserMenu from "./auth-user-menu";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import UserAvatar from "./user-avatar";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import { hasStaffClaim } from "@/app/lib/utils";
import { User } from "lucide-react";
import SignOutButton from "./sign-out-button";

export default async function SiteAuth() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const isStaff = session && hasStaffClaim(session);

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isStaff && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    // <AuthUserMenu user={user} />
    <Button asChild>
      <Link href="/login" data-testid="login">
        Login
      </Link>
    </Button>
  );
}
