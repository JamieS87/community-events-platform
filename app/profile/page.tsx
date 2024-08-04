import GoogleIcon from "@/components/google-icon";
import LinkGoogleAccountButton from "@/components/link-google-account-button";
import UserAvatar from "@/components/user-avatar";
import UserPurchasedEvents from "@/components/user-purchased-events";
import { createClient } from "@/utils/supabase/server";
import { getUserFullName } from "@/utils/user/utils";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createClient();

  const [
    { data: userData, error: userError },
    { data: identityData, error: identityError },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getUserIdentities(),
  ]);

  if (userError || identityError) {
    return redirect("/login");
  }

  const user = userData.user;

  const googleIdentity = identityData.identities.find(
    (identity) => identity.provider === "google"
  );

  return (
    <div className="flex flex-col p-2 gap-y-8 mt-8 w-full max-w-7xl mx-auto">
      <div
        className="flex items-center mx-auto space-x-4"
        data-testid="profile-user"
      >
        <UserAvatar
          user={user}
          data-testid="profile-avatar"
          className="w-16 h-16"
        />
        <div className="flex flex-col">
          <p>{getUserFullName(user) || ""}</p>
          <p className="font-semibold text-md">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {!googleIdentity && <LinkGoogleAccountButton />}
        {googleIdentity && identityData.identities.length > 1 && (
          <div className="flex items-center border rounded-lg p-2 px-4">
            <div className="w-6 h-6 mr-4">
              <GoogleIcon />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-sm">Google account linked</p>
              <p className="font-semibold">
                {googleIdentity.identity_data?.email}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="font-semibold text-xl">My Purchased Events</h2>
      </div>
      <UserPurchasedEvents />
    </div>
  );
}
