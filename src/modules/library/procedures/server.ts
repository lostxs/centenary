import { desc, eq } from "drizzle-orm";

import { tracks_table } from "~/drizzle/schema";
import { protectedProcedure, router } from "~/server/trpc";

export const libraryRouter = router({
  getTracks: protectedProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const tracks = await db
      .select()
      .from(tracks_table)
      .where(eq(tracks_table.userId, user.id))
      .orderBy(desc(tracks_table.createdAt));

    return tracks;
  }),
});
