import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  PORT: z.string().default("3335"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const config = envSchema.parse(process.env);
