"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  return (
    <Button
      className="w-full"
      variant="link"
      size="sm"
      onClick={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
