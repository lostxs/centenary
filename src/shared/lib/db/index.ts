import { neon } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "~/drizzle/schema";
import { env } from "~/env";

const sql = neon(env.POSTGRES_URL);

export const db = drizzle({
  client: sql,
  schema,
});

export type DB = typeof db;

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});
