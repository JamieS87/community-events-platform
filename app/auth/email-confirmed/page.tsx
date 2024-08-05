import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function EmailConfirmedPage() {
  return (
    <div className="min-h-screen max-w-7xl flex flex-col items-center justify-center gap-y-20">
      <div className="mx-auto my-auto p-4 flex flex-col gap-y-4">
        <h2 className="text-xl font-semibold flex items-center justify-center">
          Email Confirmed <CheckCircle className="w-8 h-6 ml-4" />
        </h2>
        <p>Email confirmed successfully. You may now log in to your account.</p>
        <Button asChild className="mx-auto">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
