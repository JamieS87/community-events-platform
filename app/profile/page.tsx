import UserAvatar from "@/components/user-avatar";
import UserPurchasedEvents from "@/components/user-purchased-events";
import { createClient } from "@/utils/supabase/server";
import { getUserFullName } from "@/utils/user/utils";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col p-2 space-y-4 w-full max-w-6xl mx-auto">
      <div
        className="flex items-center mx-auto space-x-4"
        data-testid="profile-user"
      >
        <UserAvatar
          user={user}
          className="w-16 h-16"
          data-testid="profile-avatar"
        />
        <div className="flex flex-col">
          <p>{getUserFullName(user) || ""}</p>
          <p>{user.email}</p>
        </div>
      </div>
      <h2>My Events</h2>
      <UserPurchasedEvents />
    </div>
  );
}
