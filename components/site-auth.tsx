"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import UserAvatar from "./user-avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Gavel, LogOut, UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/lib/actions/auth";

type SiteAuthProps = {
  user: User | null;
  isStaff: boolean;
};
export default function SiteAuth({ user, isStaff }: SiteAuthProps) {
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className="border-2 border-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={12}>
        {isStaff && (
          <DropdownMenuItem className="py-2" asChild>
            <Link href="/admin" className="flex items-center w-full">
              <Gavel className="w-6 h-6 mr-4" />
              <span className="font-semibold">Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="py-2" asChild>
          <Link href="/profile" className="flex items-center w-full">
            <UserIcon className="w-6 h-6 mr-4" />
            <span className="font-semibold">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="py-2"
          onClick={async () => await signOut()}
        >
          <div className="flex items-center">
            <LogOut className="w-6 h-6 mr-4" />
            <span className="font-semibold">Sign out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      className="bg-foreground text-background hover:bg-foreground/80"
      asChild
    >
      <Link href="/login" data-testid="login">
        Login
      </Link>
    </Button>
  );
}
