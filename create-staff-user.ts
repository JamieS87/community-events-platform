import { createClient } from "@supabase/supabase-js";
import { Database } from "./dbtypes";
import { Command, InvalidArgumentError } from "commander";
import { z } from "zod";
import { config } from "dotenv";

config();

const supabase = createClient<Database>(
  process.env.SUPABASE_API_URL!!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!!
);

const createStaffUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    throw error;
  }
  const { error: setStaffError } = await supabase
    .from("profiles")
    .update({ is_staff: true })
    .eq("user_id", data.user.id);
  if (setStaffError) {
    throw setStaffError;
  }
  return data.user;
};

function parseEmail(email: string, dummyPrevious: string) {
  try {
    const parsedEmail = z.string().email().parse(email);
    return parsedEmail;
  } catch (error) {
    throw new InvalidArgumentError("Not a valid email address");
  }
}

function parsePassword(email: string, dummyPrevious: string) {
  try {
    const parsedPassword = z.string().min(10).parse(email);
    return parsedPassword;
  } catch (error) {
    throw new InvalidArgumentError(
      "Password must be at least 10 characters in length"
    );
  }
}

const program = new Command();

program
  .requiredOption("-e, --email <string>", "Email address", parseEmail)
  .requiredOption("-p, --password <string>", "Password", parsePassword);

program.parse(process.argv);

const email = program.opts().email;
const password = program.opts().password;

createStaffUser(email, password)
  .then((user) => {
    console.log(`Created staff user with email: ${user.email}`);
  })
  .catch((err) => {
    console.log(`Encountered an error creating staff user.`);
    console.log(err);
  });
