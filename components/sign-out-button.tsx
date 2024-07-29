"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/lib/actions/auth";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  return (
    <Button
      className="w-full"
      variant="link"
      size="sm"
      onClick={async () => {
        await signOut();
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
