import type { Config } from "drizzle-kit";
import { z } from "zod";

const envSchema = z.object({
  POSTGRES_URL: z.string().min(1),
});

const { POSTGRES_URL } = envSchema.parse(process.env);

export default {
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: POSTGRES_URL,
  },
  casing: "snake_case",
  verbose: true,
  strict: true,
} satisfies Config;
