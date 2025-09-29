import { config } from "@/config/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/infrastructure/out/persistence/drizzle",
  schema: "./src/infrastructure/out/persistence/schemas/*",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
