import { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "./supabase";

const serviceClient = createSupabaseServiceClient();

export const createUser = async (
  email: string,
  password: string,
  email_confirm: boolean
) => {
  const {
    data: { user },
    error,
  } = await serviceClient.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm,
  });
  if (error) throw error;
  return user;
};

export const createStaffUser = async (
  email: string,
  password: string,
  email_confirm: boolean
) => {
  const user = await createUser(email, password, email_confirm);
  const { error } = await serviceClient
    .from("profiles")
    .update({ is_staff: true })
    .eq("user_id", user.id);
  if (error) throw error;
  return user;
};

export const deleteAllUsers = async () => {
  const {
    data: { users },
    error,
  } = await serviceClient.auth.admin.listUsers();
  if (error) throw error;
  for (const user of users) {
    const { error } = await serviceClient.auth.admin.deleteUser(user.id);
    if (error) throw error;
  }
};

export const deleteAllProfiles = async () => {
  const { error } = await serviceClient
    .from("profiles")
    .delete()
    .neq("user_id", "00000000-0000-0000-0000-000000000000");
  if (error) throw error;
};

export const deleteAllEvents = async () => {
  const { error } = await serviceClient.from("events").delete().neq("id", -1);
  if (error) throw error;
};

export const deleteAllPurchasedEvents = async () => {
  const { error } = await serviceClient
    .from("purchased_events")
    .delete()
    .neq("id", -1);
  if (error) throw error;
};

export const deleteAllCustomers = async () => {
  const { error } = await serviceClient
    .from("customers")
    .delete()
    .neq("user_id", "00000000-0000-0000-0000-000000000000");
  if (error) throw error;
};

const createTestEvents = async () => {
  const events = [
    { name: "Unpublished test event 1", description: "This is a test event" },
    {
      name: "Unpublished event!",
      description: "This is an unpublished event",
      published: false,
    },
    {
      name: "Published test event 1",
      description: "This is a test event",
      published: true,
    },
  ];
  const createdEvents = [];
  for (const event of events) {
    const { data: createdEvent, error } = await serviceClient
      .from("events")
      .insert(event)
      .select("*")
      .single();
    if (error) throw error;
    createdEvents.push(createdEvent);
  }
  return createdEvents;
};

export const createPurchasedEvent = async (
  user: User,
  event: Record<string, any>,
  wh_event_id: string,
  cs_id: string
) => {
  const { error } = await serviceClient.from("purchased_events").insert({
    user_id: user.id,
    event_id: event.id,
    wh_event_id,
    cs_id,
  });
  if (error) throw error;
};

export const cleanUp = async () => {
  await deleteAllUsers();
  await deleteAllCustomers();
  await deleteAllEvents();
  await deleteAllPurchasedEvents();
  await deleteAllProfiles();
};

export const seed = async () => {
  const createdData: { users: User[]; events: Record<string, any>[] } = {
    users: [],
    events: [],
  };

  //Delete any lingering test data so we have a clean slate
  await cleanUp();

  const users = [];

  const basicUser = await createUser("testuser@test", "testuser@test", true);
  const staffUser = await createStaffUser("teststaffuser@test", "teststaffuser@test", true);
  users.push(basicUser, staffUser);

  createdData.users = [...users];
  createdData.events = await createTestEvents();
  
  return createdData;
};
