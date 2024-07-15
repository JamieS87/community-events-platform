import { createSupabaseClient } from "../utils/supabase";

import { createPurchasedEvent, seed } from "../utils/seedtests";
let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
  await createPurchasedEvent(
    seedData.users[0],
    seedData.events[0],
    "test_event_wh_id",
    "test_event_cs_id"
  );

  await createPurchasedEvent(
    seedData.users[1],
    seedData.events[0],
    "test_event_wh_id_2",
    "test_event_cs_id_2"
  );
  return;
});

describe("Tests purchased events", () => {
  //Unauthenticated CRUD
  test("unauthenticated users cannot see purchased events", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("purchased_events").select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });
  test("unauthenticated users cannot create purchased events", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("purchased_events").insert({
      user_id: seedData.users[0].id,
      event_id: seedData.events[0].id,
      wh_event_id: "test_webhook_event_id",
      cs_id: "test checkout session id",
    });
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });
  test("unauthenticated users cannot update purchased events", async () => {
    const client = await createSupabaseClient();
    const { error } = await client
      .from("purchased_events")
      .update({ user_id: seedData.users[1].id })
      .eq("user_id", seedData.users[0].id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });
  test("unauthenticated users cannot delete purchased events", async () => {
    const client = await createSupabaseClient();
    const { error } = await client
      .from("purchased_events")
      .delete()
      .eq("user_id", seedData.users[0].id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });

  //Authenticated CRUD
  test("Authenticated users can see their own purchased events", async () => {
    const client = await createSupabaseClient();

    const {
      data: { user },
      error: signInError,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { data: events, error } = await client
      .from("purchased_events")
      .select("*");
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);

    events.forEach((event) => {
      expect(event.user_id).toBe(user.id);
    });
  });
  test("Authenticated users cannot create purchased events", async () => {
    const client = await createSupabaseClient();

    const {
      data: { user },
      error: signInError,
    } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client.from("purchased_events").insert({
      user_id: user.id,
      event_id: seedData.events[1].id,
      wh_event_id: "any event id",
      cs_id: "any cs id",
    });
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });
  test("Authenticated users cannot update purchased events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client
      .from("purchased_events")
      .update({ wh_event_id: "updated wh event id" })
      .eq("event_id", seedData.events[0].id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });
  test("Authenticated users cannot delete purchased events", async () => {
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
      .from("purchased_events")
      .delete()
      .eq("user_id", user.id)
      .select("*");
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      "permission denied for table purchased_events"
    );
  });
});
