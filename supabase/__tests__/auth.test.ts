import { createSupabaseClient } from "../utils/supabase";
import { seed } from "../utils/seedtests";
import { jwtDecode } from "jwt-decode";

let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
  return;
});

describe("Test authentication", () => {
  test("Can authenticate with email and password", async () => {
    const client = await createSupabaseClient();
    const {
      data: { user },
      error,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    expect(error).toBe(null);
    expect(user.email).toBe("testuser@test");
  });

  test("If a user is a staff member, their claims will include staff=true", async () => {
    const client = await createSupabaseClient();
    const {
      data: { session },
      error,
    } = await client.auth.signInWithPassword({
      email: "teststaffuser@test",
      password: "teststaffuser@test",
    });
    const decodedAccessToken = jwtDecode(session.access_token);
    expect(error).toBe(null);
    expect(decodedAccessToken).toMatchObject({ app_metadata: { staff: true } });
  });

  test("If a user is not a staff member, they won't have a staff claim", async () => {
    const client = await createSupabaseClient();
    const {
      data: { session },
      error,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    const decodedAccessToken = jwtDecode(session.access_token);
    expect(error).toBe(null);
    expect(
      (<Record<string, any> & { app_metadata?: Record<string, any> }>(
        decodedAccessToken
      )).app_metadata.staff
    ).toBeUndefined();
  });
});
