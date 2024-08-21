import { Database } from "@/dbtypes";
import { test as setup } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_API_URL!!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!!
);

setup("Seed database", async ({}) => {
  // -- VALUES ('CoffeeFest', 'Coffee lovers unite', '01-08-2030', '01-08-2030', '10:00', '20:00', true, 'free', 0),
  // --        ('StarbucksStock', 'Starbucks coffee lovers unite', '01-08-2030', '02-08-2030', '11:00', '21:00', true, 'paid', 100),
  // --        ('Costapocalypse', 'World ending coffee event', '02-08-2030', '04-08-2030', '11:00', '21:00', false, 'paid', 100),
  // --       ('Beananza', 'It''s a bonanza of coffee', '02-08-2030', '04-08-2030', '11:00', '21:00', true, 'payf', 200);

  //create events
  const results = await Promise.all([
    supabase.from("events").insert({
      name: "CoffeeFest",
      description: "This is a test event",
      start_date: "01-08-2030",
      end_date: "01-08-2030",
      start_time: "10:00",
      end_time: "20:00",
      published: true,
      pricing_model: "free",
      price: 0,
    }),
    supabase.from("events").insert({
      name: "StarbuckStock",
      description: "This is a test event",
      start_date: "01-08-2030",
      end_date: "02-08-2030",
      start_time: "11:00",
      end_time: "21:00",
      published: true,
      pricing_model: "paid",
      price: 100,
    }),
    supabase.from("events").insert({
      name: "Beananza",
      description: "This is a test event",
      start_date: "01-08-2030",
      end_date: "02-08-2030",
      start_time: "11:00",
      end_time: "21:00",
      published: true,
      pricing_model: "payf",
      price: 200,
    }),
    supabase.from("events").insert({
      name: "Costapocalypse",
      description: "This is a test event",
      start_date: "02-08-2030",
      end_date: "04-08-2030",
      start_time: "11:00",
      end_time: "21:00",
      published: false,
      pricing_model: "paid",
      price: 100,
    }),
  ]);
  for (const event of results) {
    if (event.error) {
      throw event.error;
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: "eventfan@dev.com",
    password: "eventfan@dev.com",
    email_confirm: true,
  });
  if (error) throw error;
});
