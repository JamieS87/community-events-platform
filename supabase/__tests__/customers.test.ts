import { createSupabaseClient } from "../utils/supabase";

import { seed } from "../utils/seedtests";
let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
});

describe("Test customers authorization", () => {
  //Unauthenticated CRUD
  test("unauthenticated users cannot see customers", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("customers").select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
  test("unauthenticated users cannot create customers", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("customers").insert({
      user_id: seedData.users[0].id,
      customer_id: seedData.events[0].id,
    });
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
  test("unauthenticated users cannot update customers", async () => {
    const client = await createSupabaseClient();
    const { error } = await client
      .from("customers")
      .update({ user_id: seedData.users[1].id })
      .eq("user_id", seedData.users[0].id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
  test("unauthenticated users cannot delete customers", async () => {
    const client = await createSupabaseClient();
    const { error } = await client
      .from("customers")
      .delete()
      .eq("user_id", seedData.users[0].id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });

  //Authenticated CRUD
  test("Authenticated users cannot see customers", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client.from("customers").select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
  test("Authenticated users cannot create customers", async () => {
    const client = await createSupabaseClient();

    const {
      data: { user },
      error: signInError,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client.from("customers").insert({
      user_id: user.id,
    });
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
  test("Authenticated users cannot update customers", async () => {
    const client = await createSupabaseClient();

    const {
      data: { user },
      error: signInError,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client
      .from("customers")
      .update({ user_id: user.id })
      .eq("user_id", user.id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
  test("Authenticated users cannot delete customers", async () => {
    const client = await createSupabaseClient();

    const {
      data: { user },
      error: signInError,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client
      .from("customers")
      .delete()
      .eq("user_id", user.id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch("permission denied for table customers");
  });
});
