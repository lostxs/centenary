import { headers as nextHeaders } from "next/headers";

import { createContext } from "~/server/context";

export const createRSCContext = async () => {
  const headers = new Headers(await nextHeaders());
  headers.set("x-trpc-source", "rsc");

  return createContext({
    headers,
  });
};

export type RSCContext = Awaited<ReturnType<typeof createRSCContext>>;
