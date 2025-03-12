import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "~/server/context";
import { appRouter } from "~/server/routers/_app";

const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const createHandlerContext = (req: NextRequest) => {
  return createContext({
    headers: req.headers,
  });
};

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    req,
    router: appRouter,
    createContext: () => createHandlerContext(req),
    endpoint: "/api/trpc",
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
