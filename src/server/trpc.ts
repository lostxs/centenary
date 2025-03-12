import { initTRPC, TRPCError } from "@trpc/server";
import superJSON from "superjson";
import { ZodError } from "zod";

import type { Context } from "./context";

const trpc = initTRPC.context<Context>().create({
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
    code: error.code,
  }),
  transformer: superJSON,
});

export const router = trpc.router;
export const createCallerFactory = trpc.createCallerFactory;

export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});
