"use server";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Record<string, any>;
}) {
  if (!searchParams.type) {
    throw Error("Unknown auth error");
  }

  if (searchParams.type !== "google-identity-already-linked") {
    throw Error("Unknown auth error");
  }

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto flex flex-col gap-20">
      <div className="mx-auto p-4 border mt-20 flex flex-col gap-y-4">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Google account already linked
        </h2>
        <p>
          The requested Google account is already linked to another account.
        </p>
        <Button variant="link" asChild className="mx-auto">
          <Link href={searchParams.return_to ?? "/"}>Back</Link>
        </Button>
      </div>
    </div>
  );
}
