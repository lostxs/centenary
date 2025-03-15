import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    POSTGRES_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    REDIS_TOKEN: z.string().min(1),
    // BetterAuth
    BETTER_AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    // Mux
    MUX_TOKEN_ID: z.string().min(1),
    MUX_TOKEN_SECRET: z.string().min(1),
    MUX_WEBHOOK_SECRET: z.string().min(1),
    // AWS
    S3_ENDPOINT: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
  },

  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server env
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_URL: process.env.POSTGRES_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    // BetterAuth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // Mux
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    MUX_WEBHOOK_SECRET: process.env.MUX_WEBHOOK_SECRET,
    // AWS
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    // Client env
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
