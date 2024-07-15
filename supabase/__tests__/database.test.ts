import { createSupabaseServiceClient } from "../utils/supabase";
import { seed } from "../utils/seedtests";

let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
  return;
});

describe("Test database structure and behaviour", () => {
  test("Users have a corresponding row in the profiles table", async () => {
    const client = createSupabaseServiceClient();
    for (const user of seedData.users) {
      const { data: profiles, error } = await client
        .from("profiles")
        .select("*")
        .eq("user_id", user.id);
      expect(error).toBe(null);
      expect(profiles).toHaveLength(1);
      expect(profiles[0].user_id).toBe(user.id);
    }
  });
});
