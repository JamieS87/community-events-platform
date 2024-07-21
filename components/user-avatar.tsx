"use server";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserFullName } from "@/utils/user/utils";
import { User } from "@supabase/supabase-js";

export type UserAvatarProps = {
  user: User;
  [k: string]: any;
};

export default async function UserAvatar({ user, ...props }: UserAvatarProps) {
  const avatarFallback = getUserFullName(user)?.slice(0, 1)[0];
  return (
    <Avatar {...props} data-testid="auth-avatar">
      <AvatarImage src={user.user_metadata.avatar_url} />
      <AvatarFallback className="text-xl flex items-center bg-slate-400">
        {avatarFallback || user.email?.slice(0, 1)[0].toUpperCase() || ""}
      </AvatarFallback>
    </Avatar>
  );
}
