import { cleanUp } from "./supabase/utils/seedtests";

export async function teardown() {
  await cleanUp();
}
