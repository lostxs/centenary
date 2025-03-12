import "server-only";

import { cache } from "react";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { appRouter, createCaller } from "~/server/routers/_app";
import { createQueryClient } from "../query-client";
import { createRSCContext } from "./rsc-context";

const getRSCContext = cache(createRSCContext);
export const getQueryClient = cache(createQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: getRSCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = createCaller(getRSCContext);
