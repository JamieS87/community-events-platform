// vitest.config.ts
import { defineConfig } from "vitest/config";
import { config as dotEnvConfig } from "dotenv";
import { teardown } from "./test-setup";

//Makes env vars visible inside tests
dotEnvConfig({ path: ".env" });

export default defineConfig({
  test: {
    include: ['./supabase/__tests__/**/*'],
    globals: true,
    globalSetup: ["test-setup.ts"],
    reporters: [
      "default",
      {
        async onWatcherRerun() {
          await teardown();
        },
      },
    ],
  },
});
