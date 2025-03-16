import { libraryRouter } from "~/modules/library/procedures/server";
import { tracksRouter } from "~/modules/track/procedures/server";
import { createCallerFactory, publicProcedure, router } from "../trpc";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return {
      status: "ok",
    };
  }),
  tracks: tracksRouter,
  library: libraryRouter,
});

export const createCaller = createCallerFactory(appRouter);
export type AppRouter = typeof appRouter;
