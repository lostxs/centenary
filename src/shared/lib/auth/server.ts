import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";

import * as schema from "~/drizzle/schema";
import { env } from "~/env";
import { db, redis } from "~/shared/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users: schema.users_table,
      verifications: schema.verifications_table,
      accounts: schema.accounts_table,
    },
    usePlural: true,
  }),
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key);
      return value ? JSON.stringify(value) : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { ex: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          image: profile.picture,
        };
      },
    },
  },
  plugins: [nextCookies(), openAPI()],
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
