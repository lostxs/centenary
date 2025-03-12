import { auth } from "~/shared/lib/auth/server";
import { db, redis } from "~/shared/lib/db";

export const createContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    redis,
    session,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
