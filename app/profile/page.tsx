import GoogleIcon from "@/components/google-icon";
import LinkGoogleAccountButton from "@/components/link-google-account-button";
// import SyncCalendarButton from "@/components/sync-calendar-button";
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
    <div className="flex flex-col p-2 space-y-4 w-full max-w-6xl mx-auto">
      <div
        className="flex items-center mx-auto space-x-4"
        data-testid="profile-user"
      >
        <UserAvatar user={user} data-testid="profile-avatar" />
        <div className="flex flex-col">
          <p>{getUserFullName(user) || ""}</p>
          <p className="font-semibold text-md">{user.email}</p>
        </div>
      </div>
      <div>
        {!googleIdentity && <LinkGoogleAccountButton />}
        {googleIdentity && identityData.identities.length > 1 && (
          <div className="flex items-center">
            <div className="w-6 h-6 mr-4">
              <GoogleIcon />
            </div>
            Google account linked
            {googleIdentity.identity_data?.email}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">My Events</h2>
        {/* <SyncCalendarButton /> */}
      </div>
      <UserPurchasedEvents />
    </div>
  );
}
