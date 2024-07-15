import { Session, User } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";

//Utility function for checking whether a user has the 'staff' claim
//in their session's access_token. This function should only be used
//for authorization if row-level security is enabled on the backend.
export const hasStaffClaim = (session: Session) => {
  const { access_token } = session;
  let decodedAccessToken: { app_metadata?: { staff?: boolean } } = {};
  decodedAccessToken = jwtDecode(access_token);
  const { app_metadata } = decodedAccessToken;
  if (!app_metadata) return false;
  if (app_metadata.staff === undefined) return false;
  return app_metadata.staff;
};

export const hasGoogleIdentity = (user: User) => {
  if (!user.identities) return false;
  return (
    user.identities.find((identity) => identity.provider === "google") !==
    undefined
  );
};
