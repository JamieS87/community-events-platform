import { createSupabaseClient } from "../utils/supabase";

import { seed } from "../utils/seedtests";
let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
  return;
});

describe("Test events authorization", () => {
  //Unauthenticated CRUD
  test("unauthenticated users can see events", async () => {
    const client = await createSupabaseClient();
    const { data: events, error } = await client.from("events").select("*");
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);
  });
  test("unauthenticated users can only see published events", async () => {
    const client = await createSupabaseClient();
    const {
      data: events,
      error,
      count,
    } = await client.from("events").select("*", { count: "exact" });
    const numPublishedTestEvents = seedData.events.filter(
      (event) => event.published === true
    ).length;
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);
    expect(count).toBe(numPublishedTestEvents);
  });
  test("unauthenticated users cannot create events", async () => {
    const client = await createSupabaseClient();
    const { error } = await client.from("events").insert({
      name: "Test event 2",
      description: "This is an event created by an anonymous user",
    });
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      'new row violates row-level security policy for table "events"'
    );
  });
  test("unauthenticated users cannot update events", async () => {
    const client = await createSupabaseClient();
    const { data, error } = await client
      .from("events")
      .update({ name: "Updated event!" })
      .eq("id", seedData.events[0].id)
      .select("*");
    expect(error).toBe(null);
    expect(data).toHaveLength(0);
  });
  test("unauthenticated users cannot delete events", async () => {
    const client = await createSupabaseClient();
    const { data, error } = await client
      .from("events")
      .delete()
      .eq("id", seedData.events[0].id)
      .select("*");
    expect(error).toBe(null);
    expect(data).toHaveLength(0);
  });

  //Authenticated CRUD
  test("Authenticated users can see events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { data: events, error } = await client.from("events").select("*");
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);
  });
  test("Authenticated users can only see published events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const {
      data: events,
      error,
      count,
    } = await client.from("events").select("*", { count: "exact" });
    const numPublishedTestEvents = seedData.events.filter(
      (event) => event.published === true
    ).length;
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);
    expect(count).toBe(numPublishedTestEvents);
  });
  test("Authenticated users cannot create events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { error } = await client.from("events").insert({
      name: "Test event 2",
      description: "This is an event created by an anonymous user",
    });
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      'new row violates row-level security policy for table "events"'
    );
  });
  test("Authenticated users cannot update events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { data, error } = await client
      .from("events")
      .update({ name: "Updated event!" })
      .eq("id", seedData.events[0].id)
      .select("*");
    expect(error).toBe(null);
    expect(data).toHaveLength(0);
  });
  test("Authenticated users cannot delete events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "testuser@test",
      password: "testuser@test",
    });
    if (signInError) throw signInError;

    const { data, error } = await client
      .from("events")
      .delete()
      .eq("id", seedData.events[0].id)
      .select("*");
    expect(error).toBe(null);
    expect(data).toHaveLength(0);
  });

  //Staff CRUD
  test("Authenticated staff can see events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "teststaffuser@test",
      password: "teststaffuser@test",
    });
    if (signInError) throw signInError;

    const { data: events, error } = await client.from("events").select("*");
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);
  });
  test("Authenticated staff can see all events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "teststaffuser@test",
      password: "teststaffuser@test",
    });
    if (signInError) throw signInError;

    const {
      data: events,
      error,
      count,
    } = await client.from("events").select("*", { count: "exact" });
    const numTestEvents = seedData.events.length;
    expect(error).toBe(null);
    expect(events).not.toHaveLength(0);
    expect(count).toBe(numTestEvents);
  });

  test("Authenticated staff can create events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "teststaffuser@test",
      password: "teststaffuser@test",
    });
    if (signInError) throw signInError;

    const { data: event, error } = await client
      .from("events")
      .insert({
        name: "Test event 2",
        description: "This is an event created by a staff user",
      })
      .select("*")
      .single();
    expect(error).toBe(null);
    expect(event.name).toBe("Test event 2");
  });
  test("Authenticated staff can update events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "teststaffuser@test",
      password: "teststaffuser@test",
    });
    if (signInError) throw signInError;

    const { data: event, error } = await client
      .from("events")
      .update({ name: "Updated event!" })
      .eq("id", seedData.events[0].id)
      .select("*")
      .single();
    expect(error).toBe(null);
    expect(event.name).toBe("Updated event!");
  });
  test("Authenticated staff can delete events", async () => {
    const client = await createSupabaseClient();

    const { error: signInError } = await client.auth.signInWithPassword({
      email: "teststaffuser@test",
      password: "teststaffuser@test",
    });
    if (signInError) throw signInError;

    const { data, error } = await client
      .from("events")
      .delete()
      .eq("id", seedData.events[0].id)
      .select("*");
    expect(error).toBe(null);
    expect(data).toHaveLength(1);
  });
});
