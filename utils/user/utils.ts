import { User } from "@supabase/supabase-js";

export function getUserFullName(user: User) {
  const { user_metadata } = user;
  if (user_metadata.name) {
    return user_metadata.name;
  } else if (user_metadata.full_name) {
    return user_metadata.full_name;
  } else if (user_metadata.first_name && user_metadata.last_name) {
    return user_metadata.first_name + " " + user_metadata.last_name;
  }
}
