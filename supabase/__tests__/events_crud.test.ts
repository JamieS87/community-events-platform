import { seed } from "../utils/seedtests";
import { createSupabaseServiceClient } from "../utils/supabase";

let seedData: Awaited<ReturnType<typeof seed>>;

beforeEach(async () => {
  seedData = await seed();
  return;
});

describe("Event creation", () => {
  test("Events created without specifying any fields have expected defaults", async () => {
    const client = createSupabaseServiceClient();
    const { data: createdEvent } = await client
      .from("events")
      .insert({})
      .select("*")
      .single();
    const expectedEvent = {
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      start_date: expect.any(String),
      end_date: expect.any(String),
      start_time: expect.any(String),
      end_time: expect.any(String),
      published: false,
      pricing_model: expect.any(String),
      price: expect.any(Number),
      created_at: expect.any(String),
      updated_at: null,
    };
    expect(createdEvent).toEqual(expectedEvent);
  });
  test("Events created without specifying a value for 'published' default to having published=false", async () => {
    const client = createSupabaseServiceClient();
    const { data: createdEvent  } = await client
      .from("events")
      .insert({})
      .select("*")
      .single();
    expect(createdEvent.published).toBe(false);
  });
  test("Events created with dates must have a start_date <= end_date", async () => {
    const client = createSupabaseServiceClient();
    const { error } = await client
      .from("events")
      .insert({ start_date: "2024-09-01", end_date: "2024-08-01" })
      .select("*")
      .single();
    expect(error).not.toBe(null);
  });
  test("Events that start and end on the same day must have a start time that occurs before the end time", async () => {
    const client = createSupabaseServiceClient();
    const { error } = await client
      .from("events")
      .insert({
        start_date: "2024-09-01",
        end_date: "2024-09-01",
        start_time: "12:00",
        end_time: "11:00",
      })
      .select("*")
      .single();
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      'new row for relation "events" violates check constraint "valid_dates_times"'
    );
  });
  test("Event price less than zero returns an error", async () => {
    const client = createSupabaseServiceClient();
    const { error } = await client
      .from("events")
      .insert({ price: -1 })
      .select("*")
      .single();
    expect(error).not.toBe(null);
  });
  test("Event price of zero screates an event with price 0", async () => {
    const client = createSupabaseServiceClient();
    const { data: createdEvent, error } = await client
      .from("events")
      .insert({ price: 0 })
      .select("*")
      .single();
    expect(error).toBe(null);
    expect(createdEvent.price).toBe(0);
  });
});

describe("Event updating", () => {
  test("Events can be updated", async () => {
    const client = createSupabaseServiceClient();
    const { data: updatedEvent, error } = await client
      .from("events")
      .update({ name: "This is an updated event" })
      .eq("id", seedData.events[0].id)
      .select("*")
      .single();
    expect(error).toBe(null);
    expect(updatedEvent.name).toBe("This is an updated event");
  });
  test("Updating an event validates dates and times", async () => {
    const client = createSupabaseServiceClient();
    const { error } = await client
      .from("events")
      .update({
        name: "This is an updated event",
        start_date: "2028-01-01",
        end_date: "2027-01-01",
      })
      .eq("id", seedData.events[0].id)
      .select("*")
      .single();
    expect(error).not.toBe(null);
    expect(error.message).toMatch(
      'new row for relation "events" violates check constraint "valid_dates_times"'
    );
  });

  test("Updating an event changes the updated_at timestamp", async () => {
    const client = createSupabaseServiceClient();

    const eventBeforeUpdate = { ...seedData.events[0] };

    const { data: updatedEvent } = await client
      .from("events")
      .update({
        name: "This is an updated event",
      })
      .eq("id", seedData.events[0].id)
      .select("*")
      .single();
    expect(updatedEvent.updated_at).not.toBe(eventBeforeUpdate.updated_at);
  });
});

describe("Event deletion", () => {
  test("Events can be deleted", async () => {
    const client = createSupabaseServiceClient();
    const { data: deletedEvent, error } = await client
      .from("events")
      .delete()
      .eq("id", seedData.events[0].id)
      .select("*")
      .single();
    expect(error).toBe(null);
    expect(deletedEvent.name).toBe(seedData.events[0].name);
  });
});
