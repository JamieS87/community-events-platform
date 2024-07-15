import { createSupabaseClient } from "../utils/supabase";

import { seed } from "../utils/seedtests";

let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
  return;
});

describe("Tests profiles authorization", () => {
  test("unauthenticated users cannot view profiles", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("profiles").select("*");
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });
  test("unauthenticated users cannot create profiles", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("profiles").insert({
      user_id: seedData.users[0].id,
      is_staff: true,
    });
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });
  test("unauthenticated users cannot update profiles", async () => {
    const client = await createSupabaseClient();
    const { error } = await client
      .from("profiles")
      .update({
        is_staff: true,
      })
      .eq("user_id", seedData.users[0].id);
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });
  test("unauthenticated users cannot delete profiles", async () => {
    const client = await createSupabaseClient();
    const { error } = await client
      .from("profiles")
      .delete()
      .eq("user_id", seedData.users[0].id);
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });

  test("Authenticated users cannot view profiles", async () => {
    const client = await createSupabaseClient();
    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    expect(signInError).toBe(null);
    const { error } = await client.from("profiles").select("*");
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });

  test("Authenticated users cannot create profiles", async () => {
    const client = await createSupabaseClient();
    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    expect(signInError).toBe(null);
    const { error } = await client.from("profiles").insert({
      user_id: seedData.users[0].id,
      is_staff: true,
    });
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });
  test("Authenticated users cannot update profiles", async () => {
    const client = await createSupabaseClient();
    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    expect(signInError).toBe(null);
    const { error } = await client
      .from("profiles")
      .update({
        is_staff: true,
      })
      .eq("user_id", seedData.users[0].id);
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });
  test("Authenticated users cannot delete profiles", async () => {
    const client = await createSupabaseClient();
    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    expect(signInError).toBe(null);
    const { error } = await client
      .from("profiles")
      .delete()
      .eq("user_id", seedData.users[0].id);
    expect(error).not.toBe(null);
    expect(error.code).toBe("42501");
    expect(error.message).toMatch("permission denied for table profiles");
  });
});
