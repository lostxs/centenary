import { auth } from "~/shared/lib/auth/server";
import { db } from "~/shared/lib/db";

export const createContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session,
    ...opts,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
