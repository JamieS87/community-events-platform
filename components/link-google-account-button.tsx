"use client";
import { requestLinkGoogleIdentity } from "@/app/lib/actions/auth";
import GoogleIcon from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function LinkGoogleAccount() {
  const pathname = usePathname();
  return (
    <Button
      variant={"outline"}
      className="flex items-center bg-white"
      onClick={() => {
        requestLinkGoogleIdentity(pathname);
      }}
    >
      <div className="w-6 h-6 mr-4">
        <GoogleIcon />
      </div>
      Link Google Account
    </Button>
  );
}
