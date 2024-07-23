import { calendar } from "@googleapis/calendar";
import { createGoogleServerClient } from "./server";

export const createCalendarClient = async (
  access_token: string,
  refresh_token: string
) => {
  const googleClient = await createGoogleServerClient(
    access_token,
    refresh_token
  );
  const client = calendar({ version: "v3", auth: googleClient });
  return client;
};
